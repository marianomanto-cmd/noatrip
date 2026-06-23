const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
const MONTHS_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

function parse(d) {
  if (!d) return null
  const dt = new Date(`${d}T00:00:00`)
  return isNaN(dt) ? null : dt
}

export function fmtRange(start, end) {
  const s = parse(start), e = parse(end)
  if (!s || !e) return ''
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear())
    return `${s.getDate()} → ${e.getDate()} de ${MONTHS[e.getMonth()]} de ${e.getFullYear()}`
  return `${s.getDate()} ${MONTHS_SHORT[s.getMonth()]} → ${e.getDate()} ${MONTHS_SHORT[e.getMonth()]} ${e.getFullYear()}`
}

export function fmtShort(d) {
  const dt = parse(d)
  if (!dt) return ''
  return `${dt.getDate()} ${MONTHS_SHORT[dt.getMonth()]}`
}

export function money(n, currency = 'US$') {
  return `${currency} ${Math.round(Number(n) || 0).toLocaleString('es-AR')}`
}

export function sumCosts(costs) {
  if (!Array.isArray(costs)) return 0
  return costs.reduce((a, c) => a + (Number(c?.amount) || 0), 0)
}
