import { useMemo } from 'react'
import { useTrip } from './hooks/useTrip'
import { IconSprite, Icon } from './components/ui'
import Hero from './components/Hero'
import { StickyBar, SummarySection } from './components/Summary'
import DayCard from './components/DayCard'
import NotesSection from './components/NotesSection'
import { sumCosts } from './lib/format'

export default function App() {
  const { trip, days, loading, status, saving, error, updateDay, updateTrip, addDay, removeDay, resetToDefault } = useTrip()

  const totals = useMemo(() => {
    const km = days.reduce((a, d) => a + (Number(d.distance_km) || 0), 0)
    const lodging = days.reduce((a, d) => a + (Number(d.lodging_price) || 0), 0)
    const extras = days.reduce((a, d) => a + sumCosts(d.extra_costs), 0)
    const total = lodging + extras
    const nights = days.filter((d) => (d.lodging_name || '').trim() && !/en casa|fin del viaje/i.test(d.lodging_name)).length
    return { days: days.length, nights, km, lodging, extras, total, perPerson: total / 2 }
  }, [days])

  if (loading) return <Loader />
  if (error || !trip) return <ErrorBox error={error} />

  const onReset = () => {
    if (window.confirm('Esto reemplaza TODO el itinerario por las recomendaciones iniciales. ¿Seguir?')) resetToDefault()
  }

  return (
    <div className="font-sans">
      <IconSprite />
      <StickyBar trip={trip} totals={totals} status={status} saving={saving} />
      <Hero trip={trip} updateTrip={updateTrip} daysCount={totals.days} nights={totals.nights} />
      <SummarySection trip={trip} updateTrip={updateTrip} totals={totals} />

      <main className="max-w-3xl mx-auto px-5 pb-4">
        <p className="daylabel"><Icon name="pin" /> Día por día</p>
        <h2 className="font-display text-3xl md:text-4xl text-stone-900 mt-2">Itinerario</h2>

        <div className="mt-4 flex gap-2 overflow-x-auto thin-scroll pb-1">
          {days.map((d) => (
            <a key={d.id} href={`#dia-${d.position}`} className="flex-none px-3 py-1.5 rounded-full bg-white ring-1 ring-stone-200 text-sm hover:bg-stone-100">D{d.position}</a>
          ))}
        </div>

        <div className="space-y-8 mt-6">
          {days.map((d) => (
            <DayCard key={d.id} day={d} updateDay={updateDay} removeDay={removeDay} currency={trip.currency || 'US$'} />
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
      <div className="text-center">
        <div className="text-4xl">🏔️</div>
        <p className="mt-3 animate-pulse">Cargando el viaje…</p>
      </div>
    </div>
  )
}

function ErrorBox({ error }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div>
        <p className="text-3xl">😕</p>
        <p className="mt-2 text-stone-700 font-semibold">No se pudo cargar el viaje.</p>
        <p className="mt-1 text-sm text-stone-500">{error || 'Revisá la conexión con Supabase.'}</p>
      </div>
    </div>
  )
}
