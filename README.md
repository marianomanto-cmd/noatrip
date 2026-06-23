# 🏔️ NOA Trip — Itinerario del Noroeste Argentino

App web **colaborativa** para planear (y editar entre dos) un viaje de 10 días por el Noroeste Argentino:
Córdoba → Salta → Quebrada de Humahuaca → Salinas Grandes → Cachi → Cafayate y vuelta.

Cada día/noche tiene **actividades, alojamiento, trayecto, costos y notas**, todo editable inline.
Arriba hay un **resumen en vivo** (km, noches, costos) que se recalcula solo a medida que cambian las cosas.
Los cambios se **guardan y sincronizan en tiempo real** entre los dos (Supabase Realtime).

## Stack
- **Vite + React** y **Tailwind CSS v4** (mismo estilo cálido y fotos reales del itinerario original).
- **Supabase** (proyecto `content-builder`) para datos compartidos + realtime.
- Deploy en **Vercel**.

## Desarrollo local
```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # build de producción a /dist
npm run preview   # sirve el build
```

Variables de entorno (ver `.env.example`):
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=sb_publishable_...
```
> La key *publishable* es pública por diseño (va embebida en el frontend). El acceso a los datos
> lo controla Supabase con RLS. La app trae estos valores como fallback, así que funciona aunque
> no estén seteadas las variables.

## Datos
- Tablas `trips` (1 fila, con notas) y `days` (un registro por jornada).
- La primera vez que se abre, la app **siembra** el itinerario recomendado.
- Botón **"Restaurar recomendaciones"** para volver al plan original.

## Estructura
```
src/
  data/defaultItinerary.js   # recomendaciones iniciales (seed + reset)
  lib/supabase.js            # cliente Supabase
  lib/format.js              # formato de fechas / dinero
  hooks/useTrip.js           # carga, realtime y guardado (debounced)
  components/                # Hero, Summary, DayCard, NotesSection, ui
  App.jsx
```

Hecho con ❤️ para planear el viaje.
