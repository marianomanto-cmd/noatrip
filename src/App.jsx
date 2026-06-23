import { useMemo } from 'react'
import { useTrip } from './hooks/useTrip'
import { IconSprite, Icon } from './components/ui'
import Hero from './components/Hero'
import { StickyBar, SummarySection } from './components/Summary'
import DayCard from './components/DayCard'
import NotesSection from './components/NotesSection'
import RouteMap from './components/RouteMap'
import { sumCosts, activeOption, rangeLabel } from './lib/format'
import { resolvePlace } from './lib/places'

export default function App() {
  const { trip, days, loading, status, saving, error, updateTrip, updateDayOption, setSelected, moveDay, addDay, removeDay, resetToDefault } = useTrip()

  const totals = useMemo(() => {
    let km = 0, lodging = 0, extras = 0, nights = 0
    days.forEach((d) => {
      const a = activeOption(d)
      km += Number(a.distance_km) || 0
      lodging += Number(a.lodging_price) || 0
      extras += sumCosts(a.extra_costs)
      if ((a.lodging_name || '').trim() && !/en casa|fin del viaje/i.test(a.lodging_name)) nights++
    })
    const total = lodging + extras
    return { days: days.length, nights, km, lodging, extras, total, perPerson: total / 2 }
  }, [days])

  const stops = useMemo(() => {
    const seq = []
    days.forEach((d, i) => {
      const a = activeOption(d)
      if (i === 0 && a.from_place) seq.push(a.from_place)
      seq.push(a.to_place || a.from_place)
    })
    const out = []
    let last = null
    seq.forEach((name) => {
      const p = resolvePlace(name)
      if (!p) return
      const k = `${p.lng},${p.lat}`
      if (k === last) return
      out.push({ key: `${out.length}-${k}`, label: p.label, lng: p.lng, lat: p.lat })
      last = k
    })
    return out
  }, [days])

  if (loading) return <Loader />
  if (error || !trip) return <ErrorBox error={error} />

  const onReset = () => { if (window.confirm('Esto reemplaza TODO el itinerario por las recomendaciones iniciales. ¿Seguir?')) resetToDefault() }

  return (
    <div className="font-sans">
      <IconSprite />
      <StickyBar trip={trip} totals={totals} status={status} saving={saving} />
      <Hero trip={trip} updateTrip={updateTrip} daysCount={totals.days} nights={totals.nights} rangeText={rangeLabel(trip.start_date, totals.days)} />
      <SummarySection trip={trip} updateTrip={updateTrip} totals={totals} />

      {/* Mapa */}
      <section id="mapa" className="max-w-3xl mx-auto px-5 py-6">
        <p className="daylabel"><Icon name="pin" /> Recorrido</p>
        <h2 className="font-display text-3xl md:text-4xl text-stone-900 mt-2 mb-1">El trayecto en el mapa</h2>
        <p className="text-sm text-stone-500 mb-4">Se actualiza al reordenar los días o cambiar destinos. Los números siguen el orden del itinerario.</p>
        <RouteMap stops={stops} />
        {stops.length === 0 && <p className="text-sm text-stone-500 mt-2">Agregá destinos reconocidos (Salta, Purmamarca, Cachi, Cafayate…) para ver el trayecto.</p>}
      </section>

      <main className="max-w-3xl mx-auto px-5 pb-4">
        <p className="daylabel"><Icon name="pin" /> Día por día</p>
        <h2 className="font-display text-3xl md:text-4xl text-stone-900 mt-2">Itinerario</h2>

        <div className="mt-4 flex gap-2 overflow-x-auto thin-scroll pb-1">
          {days.map((d, i) => (
            <a key={d.id} href={`#dia-${i + 1}`} className="flex-none px-3 py-1.5 rounded-full bg-white ring-1 ring-stone-200 text-sm hover:bg-stone-100">D{i + 1}</a>
          ))}
        </div>

        <div className="space-y-8 mt-6">
          {days.map((d, i) => (
            <DayCard
              key={d.id} day={d} index={i} startDate={trip.start_date}
              isFirst={i === 0} isLast={i === days.length - 1}
              updateDayOption={updateDayOption} setSelected={setSelected} moveDay={moveDay} removeDay={removeDay}
              currency={trip.currency || 'US$'}
            />
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={addDay} className="inline-flex items-center gap-2 bg-clay text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-clay-dark transition-colors">
            <Icon name="plus" className="w-4 h-4" /> Agregar día
          </button>
          <button onClick={onReset} className="inline-flex items-center gap-2 bg-white ring-1 ring-stone-300 text-stone-600 font-semibold px-4 py-2.5 rounded-xl hover:bg-stone-50 transition-colors">
            ↺ Restaurar recomendaciones
          </button>
        </div>
      </main>

      <NotesSection trip={trip} updateTrip={updateTrip} />

      <footer className="max-w-3xl mx-auto px-5 py-10 mt-8 border-t border-stone-200 text-center">
        <p className="font-display text-xl text-stone-800">¡Buen viaje! 🚙💨</p>
        <p className="text-sm text-stone-500 mt-2">Editen libremente: los cambios se guardan y se sincronizan entre los dos en tiempo real.</p>
      </footer>
    </div>
  )
}

function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center text-stone-500">
      <div className="text-center"><div className="text-4xl">🏔️</div><p className="mt-3 animate-pulse">Cargando el viaje…</p></div>
    </div>
  )
}

function ErrorBox({ error }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div><p className="text-3xl">😕</p><p className="mt-2 text-stone-700 font-semibold">No se pudo cargar el viaje.</p><p className="mt-1 text-sm text-stone-500">{error || 'Revisá la conexión.'}</p></div>
    </div>
  )
}
