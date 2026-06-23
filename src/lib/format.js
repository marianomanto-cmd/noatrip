const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
const MONTHS_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
const WEEKDAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

function parse(d) {
  if (!d) return null
  const dt = new Date(`${d}T00:00:00`)
  return isNaN(dt) ? null : dt
}

// Suma n días a una fecha base (YYYY-MM-DD) y devuelve un Date.
export function addDays(startDate, n) {
  const d = parse(startDate)
  if (!d) return null
  d.setDate(d.getDate() + n)
  return d
}

// Badge del día: "Viernes 3 jul" a partir del inicio + índice (0-based).
export function fmtDayBadge(startDate, index) {
  const d = addDays(startDate, index)
  if (!d) return ''
  return `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`
}

// Tick corto para el cronograma: "Vie 3".
export function fmtTick(startDate, index) {
  const d = addDays(startDate, index)
  if (!d) return ''
  const wd = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][d.getDay()]
  return `${wd} ${d.getDate()}`
}

// Rango del viaje a partir del inicio + cantidad de días.
export function rangeLabel(startDate, count) {
  const s = parse(startDate)
  if (!s || !count) return ''
  const e = addDays(startDate, count - 1)
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear())
    return `${s.getDate()} → ${e.getDate()} de ${MONTHS[e.getMonth()]} de ${e.getFullYear()}`
  return `${s.getDate()} ${MONTHS_SHORT[s.getMonth()]} → ${e.getDate()} ${MONTHS_SHORT[e.getMonth()]} ${e.getFullYear()}`
}

export function money(n, currency = 'US$') {
  return `${currency} ${Math.round(Number(n) || 0).toLocaleString('es-AR')}`
}

export function sumCosts(costs) {
  if (!Array.isArray(costs)) return 0
  return costs.reduce((a, c) => a + (Number(c?.amount) || 0), 0)
}

// Opción activa (la seleccionada para el costo) de un día.
export function activeOption(day) {
  if (!day) return {}
  return day.selected_option === 'B' ? (day.option_b || {}) : (day.option_a || {})
}
