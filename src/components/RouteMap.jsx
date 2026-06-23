import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'

// Estilo de mapa gratuito y sin API key.
const STYLE = 'https://tiles.openfreemap.org/styles/liberty'

export default function RouteMap({ stops }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])
  const loadedRef = useRef(false)
  const stopsRef = useRef(stops)
  stopsRef.current = stops

  function render() {
    const map = mapRef.current
    if (!map || !loadedRef.current) return
    const pts = (stopsRef.current || []).filter((s) => Number.isFinite(s.lng) && Number.isFinite(s.lat))

    const src = map.getSource('route')
    if (src) src.setData({ type: 'Feature', geometry: { type: 'LineString', coordinates: pts.map((s) => [s.lng, s.lat]) } })

    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []
    pts.forEach((s, i) => {
      const el = document.createElement('div')
      el.className = 'route-marker'
      el.textContent = String(i + 1)
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([s.lng, s.lat])
        .setPopup(new maplibregl.Popup({ offset: 16, closeButton: false }).setText(`${i + 1}. ${s.label}`))
        .addTo(map)
      markersRef.current.push(marker)
    })

    if (pts.length === 1) map.easeTo({ center: [pts[0].lng, pts[0].lat], zoom: 7 })
    else if (pts.length > 1) {
      const b = new maplibregl.LngLatBounds()
      pts.forEach((s) => b.extend([s.lng, s.lat]))
      map.fitBounds(b, { padding: 48, maxZoom: 8, duration: 600 })
    }
  }

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE,
      center: [-65.4, -24.8],
      zoom: 5,
    })
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')
    mapRef.current = map
    map.on('load', () => {
      map.addSource('route', { type: 'geojson', data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [] } } })
      map.addLayer({
        id: 'route-line', type: 'line', source: 'route',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#b4532a', 'line-width': 4, 'line-opacity': 0.85, 'line-dasharray': [2, 1.5] },
      })
      loadedRef.current = true
      render()
    })
    return () => { map.remove(); mapRef.current = null; loadedRef.current = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // re-dibuja cuando cambian las paradas (orden / lugares)
  useEffect(() => { render() }, [stops])

  return (
    <div className="relative">
      <div ref={containerRef} className="w-full h-[58vh] min-h-[340px] rounded-2xl overflow-hidden ring-1 ring-stone-200" />
    </div>
  )
}
