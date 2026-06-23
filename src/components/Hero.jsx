import { fmtRange } from '../lib/format'

export default function Hero({ trip, updateTrip, daysCount, nights }) {
  const changePhoto = () => {
    const url = window.prompt('Pegá la URL de la foto de portada:', trip.hero_photo || '')
    if (url !== null) updateTrip({ hero_photo: url.trim() })
  }
  return (
    <header className="relative min-h-[80vh] flex items-end overflow-hidden">
      {trip.hero_photo && (
        <img src={trip.hero_photo} alt="Portada del viaje" className="absolute inset-0 w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-900/35 to-stone-900/20" />

      <button
        onClick={changePhoto}
        className="absolute top-3 right-3 z-20 text-xs bg-black/40 hover:bg-black/60 text-white/90 px-3 py-1.5 rounded-full backdrop-blur"
      >
        📷 Cambiar foto
      </button>

      <div className="relative z-10 w-full max-w-3xl mx-auto px-5 pb-12 md:pb-16 text-white">
        <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[.18em] uppercase text-ochre">
          <span className="w-8 h-px bg-ochre" /> Road trip · editable entre los dos
        </p>
        <input
          value={trip.title ?? ''}
          onChange={(e) => updateTrip({ title: e.target.value })}
          placeholder="Título del viaje"
          className="block w-full bg-transparent text-white font-display font-bold text-5xl md:text-7xl leading-[0.95] mt-3 outline-none rounded-lg px-1 -mx-1 focus:bg-black/25 focus:ring-2 focus:ring-white/40 placeholder-white/40"
          style={{ textShadow: '0 2px 18px rgba(0,0,0,.45)' }}
        />
        <input
          value={trip.subtitle ?? ''}
          onChange={(e) => updateTrip({ subtitle: e.target.value })}
          placeholder="Subtítulo / recorrido"
          className="block w-full bg-transparent text-stone-200 text-base md:text-xl font-light mt-3 outline-none rounded-lg px-1 -mx-1 focus:bg-black/25 focus:ring-2 focus:ring-white/30 placeholder-white/40"
          style={{ textShadow: '0 1px 10px rgba(0,0,0,.45)' }}
        />

        <div className="mt-5 flex flex-wrap gap-2.5 text-sm">
          <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur ring-1 ring-white/25 rounded-full px-4 py-2 font-semibold">📅 {fmtRange(trip.start_date, trip.end_date)}</span>
          <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur ring-1 ring-white/25 rounded-full px-4 py-2 font-semibold">🗓️ {daysCount} días / {nights} noches</span>
          {trip.vehicle && (
            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur ring-1 ring-white/25 rounded-full px-4 py-2 font-semibold">🚙 {trip.vehicle}</span>
          )}
        </div>
      </div>
    </header>
  )
}
