import { useState } from 'react'
import { EditableText, EditableArea, EditableNumber, Icon } from './ui'
import { fmtDayBadge, money, sumCosts } from '../lib/format'

export default function DayCard({ day, index, startDate, isFirst, isLast, updateDayOption, setSelected, moveDay, removeDay, currency }) {
  const [view, setView] = useState(day.selected_option || 'A')
  const selected = day.selected_option || 'A'
  const data = (view === 'B' ? day.option_b : day.option_a) || {}
  const set = (patch) => updateDayOption(day.id, view, patch)

  const acts = data.activities || []
  const costs = data.extra_costs || []
  const dayTotal = (Number(data.lodging_price) || 0) + sumCosts(costs)

  const setAct = (i, v) => { const a = [...acts]; a[i] = v; set({ activities: a }) }
  const addAct = () => set({ activities: [...acts, ''] })
  const delAct = (i) => { const a = [...acts]; a.splice(i, 1); set({ activities: a }) }
  const setCost = (i, k, v) => set({ extra_costs: costs.map((x, j) => (j === i ? { ...x, [k]: v } : x)) })
  const addCost = () => set({ extra_costs: [...costs, { label: '', amount: 0 }] })
  const delCost = (i) => { const c = [...costs]; c.splice(i, 1); set({ extra_costs: c }) }
  const changePhoto = () => { const u = window.prompt('URL de la foto:', data.photo_url || ''); if (u !== null) set({ photo_url: u.trim() }) }
  const onDelete = () => { if (window.confirm(`¿Eliminar el Día ${index + 1}?`)) removeDay(day.id) }

  const tabCls = (t) => `px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${view === t ? 'bg-white shadow text-clay' : 'text-stone-500 hover:text-stone-700'}`

  return (
    <article id={`dia-${index + 1}`} className="scroll-mt-16 bg-white rounded-2xl shadow-sm ring-1 ring-stone-200 overflow-hidden">
      <div className="relative">
        {data.photo_url
          ? <img src={data.photo_url} alt={data.title || ''} loading="lazy" className="w-full h-48 md:h-60 object-cover" />
          : <div className="w-full h-48 md:h-60 bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center text-stone-400 text-sm">sin foto</div>}
        <div className="absolute top-3 left-3 inline-flex items-center gap-2 bg-white/90 backdrop-blur text-stone-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
          <span className="text-clay">DÍA {index + 1}</span>
          <span className="text-stone-300">·</span><span>{fmtDayBadge(startDate, index)}</span>
        </div>
        {/* reordenar */}
        <div className="absolute top-3 right-3 flex items-center gap-1">
          <button onClick={() => moveDay(day.id, -1)} disabled={isFirst} title="Subir" className="w-7 h-7 grid place-items-center rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur disabled:opacity-30 disabled:cursor-not-allowed">↑</button>
          <button onClick={() => moveDay(day.id, 1)} disabled={isLast} title="Bajar" className="w-7 h-7 grid place-items-center rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur disabled:opacity-30 disabled:cursor-not-allowed">↓</button>
          <button onClick={changePhoto} title="Cambiar foto" className="h-7 px-2 grid place-items-center rounded-full bg-black/40 hover:bg-black/60 text-white text-[11px] backdrop-blur">📷</button>
        </div>
      </div>

      <div className="p-5 md:p-6">
        {/* A/B */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="inline-flex rounded-xl bg-stone-100 p-1 ring-1 ring-stone-200">
            <button className={tabCls('A')} onClick={() => setView('A')}>Opción A {selected === 'A' && <span className="text-emerald-600">✓</span>}</button>
            <button className={tabCls('B')} onClick={() => setView('B')}>Opción B {selected === 'B' && <span className="text-emerald-600">✓</span>}</button>
          </div>
          {view === selected
            ? <span className="text-xs font-semibold text-emerald-700 inline-flex items-center gap-1">✓ Cuenta para el costo</span>
            : <button className="mini" onClick={() => setSelected(day.id, view)}>Usar esta para el costo</button>}
        </div>

        <input
          value={data.title ?? ''} onChange={(e) => set({ title: e.target.value })}
          placeholder={view === 'B' ? 'Tu alternativa para esta noche…' : 'Título del día'}
          className="block w-full bg-transparent font-display text-2xl md:text-3xl text-stone-900 mt-4 outline-none rounded-lg px-1 -mx-1 focus:bg-sand focus:ring-2 focus:ring-ochre/30"
        />

        {/* Trayecto */}
        <div className="mt-4 rounded-xl bg-sand/70 ring-1 ring-stone-200 p-3">
          <div className="flex items-center gap-2 text-stone-700">
            <Icon name="pin" className="w-4 h-4 text-clay flex-none" />
            <input value={data.from_place ?? ''} onChange={(e) => set({ from_place: e.target.value })} placeholder="Desde" className="inp font-semibold flex-1 min-w-0" />
            <span className="text-stone-400">→</span>
            <input value={data.to_place ?? ''} onChange={(e) => set({ to_place: e.target.value })} placeholder="Hasta" className="inp font-semibold flex-1 min-w-0" />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
            <span className="inline-flex items-center gap-1.5 text-stone-600"><Icon name="pin" className="w-4 h-4 opacity-70" /><EditableNumber value={data.distance_km} onChange={(v) => set({ distance_km: v })} className="!w-16" /> km</span>
            <span className="inline-flex items-center gap-1.5 text-stone-600"><Icon name="clock" className="w-4 h-4 opacity-70" /><input value={data.drive_time ?? ''} onChange={(e) => set({ drive_time: e.target.value })} placeholder="tiempo" className="inp w-28" /></span>
            <span className="inline-flex items-center gap-1.5 text-stone-600"><Icon name="car" className="w-4 h-4 opacity-70" /><input value={data.terrain ?? ''} onChange={(e) => set({ terrain: e.target.value })} placeholder="terreno" className="inp w-32" /></span>
            <span className="inline-flex items-center gap-1.5 text-amber-700"><Icon name="mtn" className="w-4 h-4 opacity-80" /><input value={data.max_altitude ?? ''} onChange={(e) => set({ max_altitude: e.target.value })} placeholder="altura (opc.)" className="inp w-44" /></span>
          </div>
        </div>

        {/* Qué hacer */}
        <section className="mt-5">
          <p className="daylabel"><Icon name="star" /> Qué hacer</p>
          <ul className="mt-2 space-y-1.5">
            {acts.map((a, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-ochre flex-none" />
                <EditableArea value={a} onChange={(v) => setAct(i, v)} minRows={1} className="flex-1 text-stone-700" placeholder="Actividad…" />
                <button onClick={() => delAct(i)} className="xbtn mt-1" title="Quitar">✕</button>
              </li>
            ))}
          </ul>
          <button onClick={addAct} className="mini mt-2"><Icon name="plus" className="w-3.5 h-3.5" /> Agregar actividad</button>
        </section>

        {/* Dónde comer */}
        <section className="mt-5">
          <p className="daylabel"><Icon name="fork" /> Dónde comer</p>
          <EditableArea value={data.gastronomy} onChange={(v) => set({ gastronomy: v })} className="mt-2 text-stone-600" placeholder="Recomendación gastronómica…" />
        </section>

        {/* Dónde dormir */}
        <section className="mt-5 bg-sand rounded-xl p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="daylabel"><Icon name="bed" /> Dónde dormir</p>
            <span className="price"><EditableNumber value={data.lodging_price} onChange={(v) => set({ lodging_price: v })} /> {currency}</span>
          </div>
          <EditableText value={data.lodging_name} onChange={(v) => set({ lodging_name: v })} className="mt-2 font-semibold text-stone-800" placeholder="Alojamiento…" />
          <EditableText value={data.lodging_notes} onChange={(v) => set({ lodging_notes: v })} className="mt-1 text-sm text-stone-500" placeholder="Notas del alojamiento (opcional)…" />
        </section>

        {/* Costos */}
        <section className="mt-5">
          <div className="flex items-center justify-between">
            <p className="daylabel"><Icon name="wallet" /> Costos del día</p>
            <span className="text-sm font-bold text-stone-700">Total: {money(dayTotal, currency)}</span>
          </div>
          <div className="mt-2 space-y-1.5">
            <div className="flex items-center gap-2 text-sm">
              <span className="flex-1 text-stone-500">🛏️ Alojamiento</span>
              <span className="text-stone-700 font-semibold">{money(data.lodging_price, currency)}</span>
            </div>
            {costs.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <input value={c.label ?? ''} onChange={(e) => setCost(i, 'label', e.target.value)} placeholder="Concepto" className="inp flex-1" />
                <EditableNumber value={c.amount} onChange={(v) => setCost(i, 'amount', v)} />
                <button onClick={() => delCost(i)} className="xbtn" title="Quitar">✕</button>
              </div>
            ))}
          </div>
          <button onClick={addCost} className="mini mt-2"><Icon name="plus" className="w-3.5 h-3.5" /> Agregar costo</button>
        </section>

        {/* Notas */}
        <section className="mt-5">
          <p className="daylabel"><Icon name="note" /> Notas</p>
          <EditableArea value={data.notes} onChange={(v) => set({ notes: v })} className="mt-2 text-sm text-stone-600" placeholder="Notas / recordatorios…" />
        </section>

        <div className="mt-5 pt-3 border-t border-stone-100 text-right">
          <button onClick={onDelete} className="text-xs text-stone-400 hover:text-red-600 inline-flex items-center gap-1">
            <Icon name="trash" className="w-3.5 h-3.5" /> Eliminar día
          </button>
        </div>
      </div>
    </article>
  )
}
