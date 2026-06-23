// Coordenadas (lng, lat) de los lugares del NOA para dibujar el trayecto en el mapa.
export const PLACES = {
  'cordoba': { label: 'Córdoba', lng: -64.1888, lat: -31.4201 },
  'salta': { label: 'Salta', lng: -65.4232, lat: -24.7821 },
  'jujuy': { label: 'Jujuy', lng: -65.2995, lat: -24.1858 },
  'san salvador de jujuy': { label: 'Jujuy', lng: -65.2995, lat: -24.1858 },
  'purmamarca': { label: 'Purmamarca', lng: -65.5008, lat: -23.7449 },
  'tilcara': { label: 'Tilcara', lng: -65.3936, lat: -23.5770 },
  'humahuaca': { label: 'Humahuaca', lng: -65.3508, lat: -23.2050 },
  'hornocal': { label: 'Hornocal', lng: -65.1700, lat: -23.0900 },
  'salinas grandes': { label: 'Salinas Grandes', lng: -65.8500, lat: -23.6260 },
  'cachi': { label: 'Cachi', lng: -66.1610, lat: -25.1207 },
  'payogasta': { label: 'Payogasta', lng: -66.1000, lat: -25.0333 },
  'seclantas': { label: 'Seclantás', lng: -66.2667, lat: -25.3000 },
  'molinos': { label: 'Molinos', lng: -66.2772, lat: -25.4386 },
  'angastaco': { label: 'Angastaco', lng: -66.1297, lat: -25.6783 },
  'san carlos': { label: 'San Carlos', lng: -65.9330, lat: -25.8950 },
  'cafayate': { label: 'Cafayate', lng: -65.9760, lat: -26.0731 },
  'piattelli': { label: 'Piattelli', lng: -65.9500, lat: -26.0500 },
  'piatelli': { label: 'Piattelli', lng: -65.9500, lat: -26.0500 },
  'tucuman': { label: 'Tucumán', lng: -65.2176, lat: -26.8083 },
  'san miguel de tucuman': { label: 'Tucumán', lng: -65.2176, lat: -26.8083 },
  'santiago del estero': { label: 'Santiago del Estero', lng: -64.2615, lat: -27.7951 },
  'rosario de la frontera': { label: 'Rosario de la Frontera', lng: -64.9656, lat: -25.7969 },
  'quebrada de las conchas': { label: 'Q. de las Conchas', lng: -65.8000, lat: -25.9000 },
}

const DIACRITICS = new RegExp('[\\u0300-\\u036f]', 'g')
const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(DIACRITICS, '').trim()

// Resuelve un nombre libre (ej. "Salta capital", "Cafayate — Hotel Killa") a un lugar conocido.
export function resolvePlace(name) {
  const n = norm(name)
  if (!n) return null
  if (PLACES[n]) return PLACES[n]
  for (const key of Object.keys(PLACES)) {
    if (n.includes(key)) return PLACES[key]
  }
  return null
}
