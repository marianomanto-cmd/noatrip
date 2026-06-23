import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import { SLUG, defaultTrip, defaultDays } from '../data/defaultItinerary'

const DEBOUNCE_MS = 650

export function useTrip() {
  const [trip, setTrip] = useState(null)
  const [days, setDays] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('connecting') // connecting | live | offline
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const dirty = useRef(new Set())   // ids con edicion local pendiente ('trip' o id de dia)
  const timers = useRef({})
  const pending = useRef({})
  const savingCount = useRef(0)

  const bumpSaving = (delta) => {
    savingCount.current = Math.max(0, savingCount.current + delta)
    setSaving(savingCount.current > 0)
  }

  // ---------- carga inicial + bootstrap ----------
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
        const rows = defaultDays.map((d) => ({ ...d, trip_id: t.id }))
        await supabase.from('days').insert(rows)
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
    const sortByPos = (arr) => [...arr].sort((a, b) => a.position - b.position)
    const ch = supabase
      .channel(`noatrip-${trip.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'days', filter: `trip_id=eq.${trip.id}` }, (payload) => {
        const { eventType, new: row, old } = payload
        if (eventType === 'DELETE') { setDays((p) => p.filter((d) => d.id !== old.id)); return }
        if (dirty.current.has(row.id)) return // no pisar lo que estoy editando
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

  // ---------- guardado debounced ----------
  const scheduleFlush = useCallback((table, key, realId) => {
    clearTimeout(timers.current[key])
    timers.current[key] = setTimeout(async () => {
      const patch = pending.current[key]
      delete pending.current[key]
      if (!patch || !realId) { dirty.current.delete(key); return }
      bumpSaving(1)
      const body = { ...patch, updated_at: new Date().toISOString() }
      const { error: err } = await supabase.from(table).update(body).eq('id', realId)
      if (err) console.error('save error', err)
      dirty.current.delete(key)
      bumpSaving(-1)
    }, DEBOUNCE_MS)
  }, [])

  const updateDay = useCallback((id, patch) => {
    setDays((p) => p.map((d) => (d.id === id ? { ...d, ...patch } : d)))
    dirty.current.add(id)
    pending.current[id] = { ...(pending.current[id] || {}), ...patch }
    scheduleFlush('days', id, id)
  }, [scheduleFlush])

  const updateTrip = useCallback((patch) => {
    setTrip((t) => ({ ...t, ...patch }))
    dirty.current.add('trip')
    pending.current['trip'] = { ...(pending.current['trip'] || {}), ...patch }
    scheduleFlush('trips', 'trip', trip?.id)
  }, [scheduleFlush, trip?.id])

  // ---------- alta / baja de dias ----------
  const addDay = useCallback(async () => {
    if (!trip?.id) return
    const pos = (days[days.length - 1]?.position || 0) + 1
    const row = {
      trip_id: trip.id, position: pos, title: 'Nuevo día', weekday: '',
      from_place: '', to_place: '', distance_km: 0, drive_time: '', terrain: '',
      activities: [], extra_costs: [], lodging_price: 0,
    }
    const { data, error: err } = await supabase.from('days').insert(row).select().single()
    if (!err && data) setDays((p) => [...p, data])
  }, [trip?.id, days])

  const removeDay = useCallback(async (id) => {
    setDays((p) => p.filter((d) => d.id !== id))
    await supabase.from('days').delete().eq('id', id)
  }, [])

  // ---------- restaurar recomendaciones ----------
  const resetToDefault = useCallback(async () => {
    if (!trip?.id) return
    await supabase.from('days').delete().eq('trip_id', trip.id)
    await supabase.from('trips').update({ ...defaultTrip }).eq('id', trip.id)
    const rows = defaultDays.map((d) => ({ ...d, trip_id: trip.id }))
    const { data } = await supabase.from('days').insert(rows).select()
    setTrip((t) => ({ ...t, ...defaultTrip }))
    setDays((data || []).sort((a, b) => a.position - b.position))
  }, [trip?.id])

  return { trip, days, loading, status, saving, error, updateDay, updateTrip, addDay, removeDay, resetToDefault, reload: load }
}
