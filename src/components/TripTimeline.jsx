import { activeOption, fmtTick } from '../lib/format'

const PALETTE = ['#b4532a', '#c98a2b', '#6b8e6b', '#7c6f52', '#8f3f1f', '#a9863c', '#5f7a8a', '#9c6b3f']

// Cronograma tipo Gantt: una barra por etapa (noches consecutivas en el mismo lugar).
export default function TripTimeline({ days, startDate }) {
  if (!days || days.length === 0) return null
  const n = days.length

  const segs = []
  days.forEach((d, i) => {
    const a = activeOption(d)
    const place = ((a.to_place || a.from_place || '—').trim()) || '—'
    const last = segs[segs.length - 1]
    if (last && last.placeKey === place.toLowerCase()) { last.span++; last.endIdx = i }
    else segs.push({ place, placeKey: place.toLowerCase(), startIdx: i, endIdx: i, span: 1 })
  })

  const colorMap = {}
  let ci = 0
  segs.forEach((s) => { if (!(s.placeKey in colorMap)) colorMap[s.placeKey] = PALETTE[ci++ % PALETTE.length] })

  const cols = { gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }
  const go = (i) => document.getElementById(`dia-${i + 1}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className="bg-white rounded-2xl ring-1 ring-stone-200 p-4">
      <div className="grid gap-1" style={cols}>
        {days.map((d, i) => (
          <div key={d.id} className="text-center px-0.5">
            <div className="text-[11px] font-bold text-stone-400 tabular-nums">D{i + 1}</div>
            <div className="text-[11px] text-stone-500 tabular-nums truncate">{fmtTick(startDate, i)}</div>
          </div>
        ))}
      </div>
      <div className="grid gap-1.5 mt-2" style={cols}>
        {segs.map((s, k) => (
          <button
            key={k}
            className="gantt-bar"
            title={`${s.place}${s.span > 1 ? ` · ${s.span} noches` : ''} — ir al día ${s.startIdx + 1}`}
            aria-label={`${s.place}, ${s.span} ${s.span > 1 ? 'noches' : 'noche'}. Ir al día ${s.startIdx + 1}`}
            style={{ gridColumn: `${s.startIdx + 1} / span ${s.span}`, background: colorMap[s.placeKey] }}
            onClick={() => go(s.startIdx)}
          >
            <span className="text-sm font-bold truncate">{s.place}</span>
            <span className="text-[11px] opacity-90 tabular-nums">{s.span > 1 ? `${s.span} noches` : '1 noche'}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
