import { EditableText, EditableArea, EditableNumber, Icon } from './ui'
import { fmtShort, money, sumCosts } from '../lib/format'

export default function DayCard({ day, updateDay, removeDay, currency }) {
  const set = (patch) => updateDay(day.id, patch)
  const acts = day.activities || []
  const costs = day.extra_costs || []
  const dayTotal = (Number(day.lodging_price) || 0) + sumCosts(costs)

  const setAct = (i, v) => { const a = [...acts]; a[i] = v; set({ activities: a }) }
  const addAct = () => set({ activities: [...acts, ''] })
  const delAct = (i) => { const a = [...acts]; a.splice(i, 1); set({ activities: a }) }
  const setCost = (i, k, v) => set({ extra_costs: costs.map((x, j) => (j === i ? { ...x, [k]: v } : x)) })
  const addCost = () => set({ extra_costs: [...costs, { label: '', amount: 0 }] })
  const delCost = (i) => { const c = [...costs]; c.splice(i, 1); set({ extra_costs: c }) }
  const changePhoto = () => { const u = window.prompt('URL de la foto del día:', day.photo_url || ''); if (u !== null) set({ photo_url: u.trim() }) }
  const onDelete = () => { if (window.confirm(`¿Eliminar el Día ${day.position}?`)) removeDay(day.id) }

  return (
    <article id={`dia-${day.position}`} className="scroll-mt-16 bg-white rounded-2xl shadow-sm ring-1 ring-stone-200 overflow-hidden">
      <div className="relative">
        {day.photo_url
          ? <img src={day.photo_url} alt={day.title || ''} loading="lazy" className="w-full h-52 md:h-64 object-cover" />
          : <div className="w-full h-52 md:h-64 bg-stone-200 flex items-center justify-center text-stone-400 text-sm">sin foto</div>}
        <div className="absolute top-3 left-3 inline-flex items-center gap-2 bg-white/90 backdrop-blur text-stone-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
          <span className="text-clay">DÍA {day.position}</span>
          {(day.weekday || day.date) && <><span className="text-stone-300">·</span><span>{day.weekday} {fmtShort(day.date)}</span></>}
        </div>
        <button onClick={changePhoto} title="Cambiar foto" className="absolute top-3 right-3 text-[11px] bg-black/40 hover:bg-black/60 text-white/90 px-2.5 py-1 rounded-full backdrop-blur">📷</button>
      </div>

      <div className="p-5 md:p-6">
        <input
          value={day.title ?? ''} onChange={(e) => set({ title: e.target.value })} placeholder="Título del día"
          className="block w-full bg-transparent font-display text-2xl md:text-3xl text-stone-900 outline-none rounded-lg px-1 -mx-1 focus:bg-sand focus:ring-2 focus:ring-ochre/30"
        />

        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-stone-500">
          <input value={day.weekday ?? ''} onChange={(e) => set({ weekday: e.target.value })} placeholder="Día" className="inp w-24" />
          <input type="date" value={day.date ?? ''} onChange={(e) => set({ date: e.target.value })} className="inp w-40" />
        </div>

        {/* Trayecto */}
        <div className="mt-4 rounded-xl bg-sand/70 ring-1 ring-stone-200 p-3">
          <div className="flex items-center gap-2 text-stone-700">
            <Icon name="pin" className="w-4 h-4 text-clay flex-none" />
            <input value={day.from_place ?? ''} onChange={(e) => set({ from_place: e.target.value })} placeholder="Desde" className="inp font-semibold flex-1 min-w-0" />
            <span className="text-stone-400">→</span>
            <input value={day.to_place ?? ''} onChange={(e) => set({ to_place: e.target.value })} placeholder="Hasta" className="inp font-semibold flex-1 min-w-0" />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
            <span className="inline-flex items-center gap-1.5 text-stone-600"><Icon name="pin" className="w-4 h-4 opacity-70" /><EditableNumber value={day.distance_km} onChange={(v) => set({ distance_km: v })} className="!w-16" /> km</span>
            <span className="inline-flex items-center gap-1.5 text-stone-600"><Icon name="clock" className="w-4 h-4 opacity-70" /><input value={day.drive_time ?? ''} onChange={(e) => set({ drive_time: e.target.value })} placeholder="tiempo" className="inp w-28" /></span>
            <span className="inline-flex items-center gap-1.5 text-stone-600"><Icon name="car" className="w-4 h-4 opacity-70" /><input value={day.terrain ?? ''} onChange={(e) => set({ terrain: e.target.value })} placeholder="terreno" className="inp w-32" /></span>
            <span className="inline-flex items-center gap-1.5 text-amber-700"><Icon name="mtn" className="w-4 h-4 opacity-80" /><input value={day.max_altitude ?? ''} onChange={(e) => set({ max_altitude: e.target.value })} placeholder="altura (opcional)" className="inp w-44" /></span>
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
          <EditableArea value={day.gastronomy} onChange={(v) => set({ gastronomy: v })} className="mt-2 text-stone-600" placeholder="Recomendación gastronómica…" />
        </section>

        {/* Dónde dormir */}
        <section className="mt-5 bg-sand rounded-xl p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="daylabel"><Icon name="bed" /> Dónde dormir</p>
            <span className="price"><EditableNumber value={day.lodging_price} onChange={(v) => set({ lodging_price: v })} /> {currency}</span>
          </div>
          <EditableText value={day.lodging_name} onChange={(v) => set({ lodging_name: v })} className="mt-2 font-semibold text-stone-800" placeholder="Alojamiento sugerido…" />
          <EditableText value={day.lodging_notes} onChange={(v) => set({ lodging_notes: v })} className="mt-1 text-sm text-stone-500" placeholder="Notas del alojamiento (opcional)…" />
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
              <span className="text-stone-700 font-semibold">{money(day.lodging_price, currency)}</span>
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
          <EditableArea value={day.notes} onChange={(v) => set({ notes: v })} className="mt-2 text-sm text-stone-600" placeholder="Notas / recordatorios del día…" />
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
