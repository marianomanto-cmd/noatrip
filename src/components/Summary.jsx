import { useState } from 'react'
import { Icon } from './ui'
import { money, rangeLabel } from '../lib/format'

function StatusPill({ status, saving }) {
  let color = 'bg-stone-400', label = 'sin conexión'
  if (saving) { color = 'bg-amber-500 animate-pulse'; label = 'guardando…' }
  else if (status === 'live') { color = 'bg-emerald-500'; label = 'en vivo' }
  else if (status === 'connecting') { color = 'bg-amber-400 animate-pulse'; label = 'conectando…' }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 whitespace-nowrap">
      <span className={`w-2 h-2 rounded-full ${color}`} /> {label}
    </span>
  )
}

export function StickyBar({ trip, totals, status, saving }) {
  const [copied, setCopied] = useState(false)
  const share = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1600) } catch { /* noop */ }
  }
  return (
    <div className="sticky top-0 z-30 bg-sand/90 backdrop-blur border-b border-stone-200">
      <div className="max-w-3xl mx-auto px-3">
        <div className="flex items-center gap-3 py-2.5 overflow-x-auto thin-scroll">
          <span className="flex-none font-display font-700 text-stone-900 text-lg pr-1">🏔️ NOA</span>
          <span className="flex-none chip">{totals.days} días · {totals.nights} noches</span>
          <span className="flex-none chip"><Icon name="pin" /> {totals.km.toLocaleString('es-AR')} km</span>
          <span className="flex-none chip alt"><Icon name="wallet" /> {money(totals.total, trip.currency)}</span>
          <span className="flex-1" />
          <span className="flex-none"><StatusPill status={status} saving={saving} /></span>
          <button onClick={share} className="flex-none chip hover:bg-stone-200" title="Copiar link para compartir">
            <Icon name="share" /> {copied ? '¡copiado!' : 'compartir'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Stat({ big, label, accent }) {
  return (
    <div className="bg-white rounded-xl ring-1 ring-stone-200 p-4">
      <p className={`font-display text-3xl ${accent ? 'text-clay' : 'text-stone-900'}`}>{big}</p>
      <p className="text-xs text-stone-500 mt-1 font-semibold uppercase tracking-wide">{label}</p>
    </div>
  )
}

export function SummarySection({ trip, updateTrip, totals }) {
  return (
    <section id="resumen" className="scroll-mt-16 max-w-3xl mx-auto px-5 py-10">
      <p className="daylabel"><Icon name="wallet" /> Resumen en vivo</p>
      <h2 className="font-display text-3xl md:text-4xl text-stone-900 mt-2">El viaje de un vistazo</h2>
      <p className="mt-3 text-stone-600 leading-relaxed">
        Se actualiza solo al editar: kilómetros, noches y costos se recalculan en el momento (contando la opción
        seleccionada de cada día). La fecha de cada jornada se calcula desde la fecha de inicio y el orden.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm bg-white rounded-xl ring-1 ring-stone-200 p-4">
        <label className="flex items-center gap-2">
          <span className="text-stone-500 font-semibold">Inicio</span>
          <input type="date" value={trip.start_date ?? ''} onChange={(e) => updateTrip({ start_date: e.target.value })} className="inp" />
        </label>
        <span className="text-sm text-stone-500">→ <b className="text-stone-700">{rangeLabel(trip.start_date, totals.days)}</b></span>
        <label className="flex items-center gap-2 flex-1 min-w-[12rem]">
          <span className="text-stone-500 font-semibold">🚙</span>
          <input value={trip.vehicle ?? ''} onChange={(e) => updateTrip({ vehicle: e.target.value })} placeholder="Vehículo" className="inp" />
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
        <Stat big={totals.days} label="días" accent />
        <Stat big={totals.nights} label="noches" accent />
        <Stat big={totals.km.toLocaleString('es-AR')} label="km totales" accent />
        <Stat big={money(totals.total, trip.currency)} label="costo total (2 pers.)" />
        <Stat big={money(totals.perPerson, trip.currency)} label="por persona" />
        <Stat big={money(totals.lodging, trip.currency)} label="alojamiento" />
      </div>

      <p className="mt-3 text-xs text-stone-500">
        Costo total = alojamiento ({money(totals.lodging, trip.currency)}) + otros costos ({money(totals.extras, trip.currency)}), sumando la opción elegida de cada día.
      </p>
    </section>
  )
}
