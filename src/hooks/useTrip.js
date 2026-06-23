import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import { SLUG, defaultTrip, defaultDays, emptyOption } from '../data/defaultItinerary'

const DEBOUNCE_MS = 650
const sortByPos = (arr) => [...arr].sort((a, b) => a.position - b.position)

export function useTrip() {
  const [trip, setTrip] = useState(null)
  const [days, setDays] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('connecting')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const dirty = useRef(new Set())
  const timers = useRef({})
  const pending = useRef({})
  const savingCount = useRef(0)
  const bump = (d) => { savingCount.current = Math.max(0, savingCount.current + d); setSaving(savingCount.current > 0) }

  // ---------- carga + bootstrap ----------
  const load = useCallback(async () => {
    setLoading(true); setError(null)
    const { data: trips, error: e1 } = await supabase.from('trips').select('*').eq('slug', SLUG).limit(1)
    if (e1) { setError(e1.message); setStatus('offline'); setLoading(false); return }
    let t = trips?.[0]
    if (!t) {
      const { data: ins, error: e2 } = await supabase.from('trips').insert({ ...defaultTrip }).select().single()
      if (e2) {
        const { data: again } = await supabase.from('trips').select('*').eq('slug', SLUG).limit(1)
        t = again?.[0]
      } else {
        t = ins
        await supabase.from('days').insert(defaultDays.map((d) => ({ ...d, trip_id: t.id })))
      }
    }
    if (!t) { setError('No se pudo cargar el viaje.'); setLoading(false); return }
    setTrip(t)
    const { data: ds } = await supabase.from('days').select('*').eq('trip_id', t.id).order('position', { ascending: true })
    setDays(ds || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  // ---------- realtime ----------
  useEffect(() => {
    if (!trip?.id) return
    const ch = supabase
      .channel(`noatrip-${trip.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'days', filter: `trip_id=eq.${trip.id}` }, (payload) => {
        const { eventType, new: row, old } = payload
        if (eventType === 'DELETE') { setDays((p) => p.filter((d) => d.id !== old.id)); return }
        if (dirty.current.has(row.id)) return
        setDays((p) => {
          const i = p.findIndex((d) => d.id === row.id)
          if (i === -1) return sortByPos([...p, row])
          const cp = [...p]; cp[i] = row; return sortByPos(cp)
        })
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'trips', filter: `id=eq.${trip.id}` }, (payload) => {
        if (dirty.current.has('trip')) return
        setTrip(payload.new)
      })
      .subscribe((s) => {
        if (s === 'SUBSCRIBED') setStatus('live')
        else if (s === 'CHANNEL_ERROR' || s === 'TIMED_OUT' || s === 'CLOSED') setStatus('offline')
      })
    return () => { supabase.removeChannel(ch) }
  }, [trip?.id])

  // ---------- guardado debounced (columnas option_a / option_b / etc) ----------
  const scheduleFlush = useCallback((key, realId) => {
    clearTimeout(timers.current[key])
    timers.current[key] = setTimeout(async () => {
      const patch = pending.current[key]; delete pending.current[key]
      if (!patch || !realId) { dirty.current.delete(key); return }
      bump(1)
      const table = key === 'trip' ? 'trips' : 'days'
      const { error: err } = await supabase.from(table).update({ ...patch, updated_at: new Date().toISOString() }).eq('id', realId)
      if (err) console.error('save error', err)
      dirty.current.delete(key); bump(-1)
    }, DEBOUNCE_MS)
  }, [])

  const updateTrip = useCallback((patch) => {
    setTrip((t) => ({ ...t, ...patch }))
    dirty.current.add('trip')
    pending.current['trip'] = { ...(pending.current['trip'] || {}), ...patch }
    scheduleFlush('trip', trip?.id)
  }, [scheduleFlush, trip?.id])

  // edita un campo dentro de option_a u option_b
  const updateDayOption = useCallback((id, opt, patch) => {
    const col = opt === 'B' ? 'option_b' : 'option_a'
    setDays((p) => p.map((d) => {
      if (d.id !== id) return d
      const merged = { ...(d[col] || {}), ...patch }
      pending.current[id] = { ...(pending.current[id] || {}), [col]: merged }
      return { ...d, [col]: merged }
    }))
    dirty.current.add(id)
    scheduleFlush(id, id)
  }, [scheduleFlush])

  // escritura inmediata (selección / reorden)
  const writeDayNow = useCallback(async (id, patch, optimistic) => {
    dirty.current.add(id)
    if (optimistic) setDays((p) => sortByPos(p.map((d) => (d.id === id ? { ...d, ...patch } : d))))
    bump(1)
    const { error: err } = await supabase.from('days').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id)
    if (err) console.error('write error', err)
    bump(-1); dirty.current.delete(id)
  }, [])

  const setSelected = useCallback((id, opt) => { writeDayNow(id, { selected_option: opt }, true) }, [writeDayNow])

  // mover un día arriba/abajo (intercambia posiciones)
  const moveDay = useCallback(async (id, dir) => {
    const ordered = sortByPos(days)
    const i = ordered.findIndex((d) => d.id === id)
    const j = i + dir
    if (i === -1 || j < 0 || j >= ordered.length) return
    const a = ordered[i], b = ordered[j]
    const pa = a.position, pb = b.position
    setDays((p) => sortByPos(p.map((d) => (d.id === a.id ? { ...d, position: pb } : d.id === b.id ? { ...d, position: pa } : d))))
    dirty.current.add(a.id); dirty.current.add(b.id); bump(1)
    await supabase.from('days').update({ position: pb, updated_at: new Date().toISOString() }).eq('id', a.id)
    await supabase.from('days').update({ position: pa, updated_at: new Date().toISOString() }).eq('id', b.id)
    bump(-1); dirty.current.delete(a.id); dirty.current.delete(b.id)
  }, [days])

  const addDay = useCallback(async () => {
    if (!trip?.id) return
    const pos = (sortByPos(days)[days.length - 1]?.position || 0) + 1
    const row = { trip_id: trip.id, position: pos, selected_option: 'A', option_a: { ...emptyOption(), title: 'Nuevo día' }, option_b: emptyOption() }
    const { data, error: err } = await supabase.from('days').insert(row).select().single()
    if (!err && data) setDays((p) => sortByPos([...p, data]))
  }, [trip?.id, days])

  const removeDay = useCallback(async (id) => {
    setDays((p) => p.filter((d) => d.id !== id))
    await supabase.from('days').delete().eq('id', id)
  }, [])

  const resetToDefault = useCallback(async () => {
    if (!trip?.id) return
    await supabase.from('days').delete().eq('trip_id', trip.id)
    await supabase.from('trips').update({ ...defaultTrip }).eq('id', trip.id)
    const { data } = await supabase.from('days').insert(defaultDays.map((d) => ({ ...d, trip_id: trip.id }))).select()
    setTrip((t) => ({ ...t, ...defaultTrip }))
    setDays(sortByPos(data || []))
  }, [trip?.id])

  return { trip, days, loading, status, saving, error, updateTrip, updateDayOption, setSelected, moveDay, addDay, removeDay, resetToDefault, reload: load }
}
