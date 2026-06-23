// Itinerario por defecto (recomendaciones iniciales).
// Cada día tiene option_a (mi recomendación) y option_b (vacía, para alternativas).
// La fecha de cada día se deriva de trip.start_date + el orden, así reordenar es automático.

export const SLUG = 'noa-2026'

const IMG = {
  hero:    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Cerro_de_los_siete_colores.jpg/1280px-Cerro_de_los_siete_colores.jpg',
  cordoba: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Cathedral_Main_Square.jpg/960px-Cathedral_Main_Square.jpg',
  purmamarca: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Jujuy-Purmamarca-P3120033.JPG/960px-Jujuy-Purmamarca-P3120033.JPG',
  salinas: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Salinas_Grandes_%28Jujuy_and_Salta%29_06.jpg/960px-Salinas_Grandes_%28Jujuy_and_Salta%29_06.jpg',
  hornocal: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Hornocal.JPG/960px-Hornocal.JPG',
  catedralSalta: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Catedral_de_Salta_Capital.JPG/960px-Catedral_de_Salta_Capital.JPG',
  cuestaObispo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Cuesta_del_obispo_01.jpg/960px-Cuesta_del_obispo_01.jpg',
  flechas: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Quebrada_de_las_Flechas_02.jpg/960px-Quebrada_de_las_Flechas_02.jpg',
  conchas: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Tour_to_the_Quebrada_de_las_Conchas.jpg/960px-Tour_to_the_Quebrada_de_las_Conchas.jpg',
  saltaPano: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Salta%2C_panor%C3%A1micas_%281994%29_01.jpg/960px-Salta%2C_panor%C3%A1micas_%281994%29_01.jpg',
}

export const emptyOption = () => ({
  title: '', from_place: '', to_place: '', distance_km: 0, drive_time: '', terrain: '',
  max_altitude: '', photo_url: '', activities: [], gastronomy: '',
  lodging_name: '', lodging_price: 0, lodging_notes: '', extra_costs: [], notes: '',
})

const dayA = (position, a) => ({ position, selected_option: 'A', option_a: a, option_b: emptyOption() })

export const defaultTrip = {
  slug: SLUG,
  title: 'Noroeste Argentino',
  subtitle: 'Córdoba · Salta · Quebrada de Humahuaca · Salinas Grandes · Cachi · Cafayate',
  start_date: '2026-07-03',
  end_date: '2026-07-12',
  vehicle: 'Jeep Compass',
  hero_photo: IMG.hero,
  currency: 'USD',
  notes: [
    { emoji: '❄️', title: 'Invierno y clima', body: 'Julio es seco y soleado de día, pero con noches muy frías. Gran amplitud térmica: ~20 °C al mediodía y hasta −5/−10 °C de noche en la Puna y la Quebrada. Llevá ropa en capas, campera abrigada, gorro y guantes.' },
    { emoji: '🌨️', title: 'Nieve y hielo en altura', body: 'La Cuesta del Obispo, la RN40 (Cachi–Cafayate), el Abra de Lipán y el Hornocal pueden amanecer con hielo o nieve. Manejá siempre de día, despacio y sin frenadas bruscas. Si nevó, esperá a que abra y consultá el estado antes de salir.' },
    { emoji: '🛞', title: 'Caminos de ripio', body: 'La RP33 (Cuesta del Obispo) y la RN40 tienen tramos largos de ripio, badenes y cornisas. Andá a 40–60 km/h, atento a piedras y pozos. Revisá la rueda de auxilio y la presión.' },
    { emoji: '⛰️', title: 'Altura y apunamiento', body: 'Vas a estar a 3.300–4.350 m (Salinas, Abra de Lipán, Hornocal, Piedra del Molino). Subí lento, hidratado y sin alcohol; comé liviano. Ayudan el mate o las hojas de coca. Si hay mareo o dolor de cabeza fuerte, bajá de altura.' },
    { emoji: '⛽', title: 'Combustible', body: 'Cargá siempre el tanque lleno antes de los tramos largos. Hay estaciones en Salta, Jujuy, Purmamarca, Humahuaca, Cachi y Cafayate. El tramo Cachi–Cafayate por RN40 casi no tiene surtidores: salí lleno.' },
    { emoji: '💵', title: 'Efectivo y pagos', body: 'Llevá efectivo en pesos: en los pueblos chicos (Salinas, Molinos, Angastaco) suele no haber posnet ni señal. Los cajeros están sólo en ciudades y se quedan sin plata los fines de semana.' },
    { emoji: '📶', title: 'Señal y mapas', body: 'La señal es intermitente o nula en la Quebrada, Salinas y la RN40. Descargá los mapas offline (Google Maps / maps.me) y avisá la ruta de cada día.' },
    { emoji: '🚗', title: 'Manejo de montaña', body: 'Prioridad para quien sube; bocina en curvas ciegas; luces bajas siempre encendidas; no te detengas en curvas. Ojo con animales sueltos (llamas, cabras, burros).' },
    { emoji: '☀️', title: 'Sol de altura', body: 'Aunque haga frío, el sol pega fortísimo en altura: protector solar alto, labial con FPS, anteojos de sol y gorro.' },
    { emoji: '⏰', title: 'Horarios y luz', body: 'En julio anochece cerca de las 18:30–19:00. Arrancá temprano y evitá manejar de noche en montaña o ripio. Muchos comercios cierran a la siesta (13–17 h).' },
    { emoji: '🧰', title: 'Checklist del auto', body: 'Licencia + cédula (verde/azul), seguro y VTV al día. Matafuegos, balizas, chaleco, criquet y rueda de auxilio OK. Llevá inflador 12V, agua, mantas, linterna, botiquín y, por las dudas, cadenas para nieve.' },
  ],
}

export const defaultDays = [
  dayA(1, {
    title: 'Córdoba → Salta', from_place: 'Córdoba', to_place: 'Salta', distance_km: 900, drive_time: '10–11 h',
    terrain: 'Asfalto · peajes', max_altitude: '', photo_url: IMG.cordoba,
    activities: [
      'Salida bien temprano (5–6 AM) por la Ruta 9 vía Santiago del Estero y Tucumán.',
      'Parada para estirar las piernas y almorzar a mitad de camino (Tucumán o Rosario de la Frontera).',
      'Llegada a Salta al atardecer: vuelta por la Plaza 9 de Julio iluminada y cena tranquila.',
      'Día de traslado para dejar montados los próximos días en la Quebrada.',
    ],
    gastronomy: 'En ruta, empanadas y locro en Rosario de la Frontera. En Salta, si llegan con energía: La Casona del Molino (peña folklórica con empanadas salteñas).',
    lodging_name: 'Salta — Hotel del Antiguo Convento (centro histórico)', lodging_price: 60, lodging_notes: 'Habitación doble.',
    extra_costs: [{ label: 'Comida (2)', amount: 55 }, { label: 'Nafta', amount: 108 }, { label: 'Peajes', amount: 15 }],
    notes: 'Tramo más largo del viaje: turnarse al volante y evitar manejar de noche el último tramo si vienen cansados.',
  }),
  dayA(2, {
    title: 'Salta → Purmamarca', from_place: 'Salta', to_place: 'Purmamarca', distance_km: 190, drive_time: '2 h 45',
    terrain: 'Asfalto', max_altitude: '', photo_url: IMG.purmamarca,
    activities: [
      'Ruta a Jujuy y entrada a la Quebrada de Humahuaca (Patrimonio UNESCO).',
      'Check-in en Purmamarca; pueblo de adobe y feria de artesanos de la plaza.',
      'Cerro de los Siete Colores desde el mirador y Paseo de los Colorados (circuito de ~3 km).',
      'Atardecer en el pueblo: cerca de las 18 h las montañas se encienden de color.',
    ],
    gastronomy: 'El Rincón de Claudia Vilte — cocina andina casera (tamales, humita en chala, guiso de llama, quinoa).',
    lodging_name: 'Purmamarca — La Comarca / Posada del Sol', lodging_price: 85, lodging_notes: 'Con vista a los cerros.',
    extra_costs: [{ label: 'Comida (2)', amount: 55 }, { label: 'Nafta', amount: 23 }],
    notes: 'Cargá nafta en Salta o Jujuy: dentro de la Quebrada y la Puna las estaciones son pocas.',
  }),
  dayA(3, {
    title: 'Salinas Grandes → Tilcara', from_place: 'Purmamarca', to_place: 'Tilcara', distance_km: 150, drive_time: '4–5 h con paradas',
    terrain: 'Asfalto', max_altitude: 'Abra de Lipán 4.170 m', photo_url: IMG.salinas,
    activities: [
      'Temprano: subir la Cuesta de Lipán hasta el abra (4.170 m), entre paisajes de puna.',
      'Salinas Grandes: caminar el salar, fotos de perspectiva y los “ojos de agua”. Conviene contratar guía local.',
      'Volver a Purmamarca a almorzar y seguir 25 km hasta Tilcara para el check-in.',
      'Tarde libre: feria artesanal y patio de comidas del pueblo.',
    ],
    gastronomy: 'En Tilcara: El Nuevo Progreso (regional de autor) o Khausi. Probá la llama, el cabrito y los postres con quinoa.',
    lodging_name: 'Tilcara — Posada de Luz / Las Terrazas (1ª de 2 noches)', lodging_price: 70, lodging_notes: '',
    extra_costs: [{ label: 'Comida (2)', amount: 55 }, { label: 'Nafta', amount: 18 }, { label: 'Guía Salinas', amount: 10 }],
    notes: 'Altura: subí hidratado, sin alcohol y despacio. En el abra puede haber viento helado y nieve; llevá abrigo, agua y anteojos (el reflejo del salar enceguece).',
  }),
  dayA(4, {
    title: 'Tilcara · Humahuaca · Hornocal', from_place: 'Tilcara', to_place: 'Tilcara', distance_km: 150, drive_time: '3–4 h al volante',
    terrain: 'Asfalto + ripio', max_altitude: 'Hornocal 4.350 m', photo_url: IMG.hornocal,
    activities: [
      'Mañana en Tilcara: Pucará de Tilcara (fortaleza prehispánica) y Garganta del Diablo.',
      'Mediodía: subir a Humahuaca (~1 h). Monumento a la Independencia, cabildo y mercado.',
      'Tarde: Serranía de Hornocal (cerro de 14 colores), 25 km de ripio empinado. Mejor luz al atardecer.',
      'Regreso a dormir a Tilcara.',
    ],
    gastronomy: 'En Humahuaca: Pacha Manka o Aiampa (cocina regional). Para el frío, un api con pastel y tamales.',
    lodging_name: 'Tilcara — mismo alojamiento (2ª noche)', lodging_price: 70, lodging_notes: '',
    extra_costs: [{ label: 'Comida (2)', amount: 55 }, { label: 'Nafta', amount: 18 }, { label: 'Entradas (Pucará/Hornocal)', amount: 15 }],
    notes: 'Día intenso: arrancá temprano. El Hornocal está a 4.350 m y el camino es de ripio; si nevó puede estar cortado — consultá en Humahuaca.',
  }),
  dayA(5, {
    title: 'Tilcara → Salta (ciudad)', from_place: 'Tilcara', to_place: 'Salta', distance_km: 190, drive_time: '~3 h',
    terrain: 'Asfalto', max_altitude: '', photo_url: IMG.catedralSalta,
    activities: [
      'Bajada tranquila por la Quebrada hacia Salta (última mirada a Purmamarca de paso).',
      'Tarde de ciudad: Plaza 9 de Julio, Catedral, Cabildo y el MAAM (niños del Llullaillaco).',
      'Teleférico al Cerro San Bernardo para ver Salta desde arriba al atardecer.',
      'Noche de peña folklórica en calle Balcarce.',
    ],
    gastronomy: 'Doña Salta (frente a la iglesia San Francisco) o Café del Tiempo (peña con música en vivo).',
    lodging_name: 'Salta capital — hotel céntrico', lodging_price: 60, lodging_notes: '',
    extra_costs: [{ label: 'Comida (2)', amount: 55 }, { label: 'Nafta', amount: 23 }, { label: 'MAAM + teleférico', amount: 20 }],
    notes: '',
  }),
  dayA(6, {
    title: 'Salta → Cachi', from_place: 'Salta', to_place: 'Cachi', distance_km: 160, drive_time: '4–4.5 h',
    terrain: 'Asfalto + ripio', max_altitude: 'Piedra del Molino 3.348 m', photo_url: IMG.cuestaObispo,
    activities: [
      'Salir temprano por la RN68 hasta El Carril y tomar la Ruta Provincial 33.',
      'Cuesta del Obispo: ascenso en cornisa; parada en la Piedra del Molino (3.348 m).',
      'Recta del Tin-Tin y Parque Nacional Los Cardones (cardones gigantes).',
      'Pasar por Payogasta y bajar a Cachi: pueblo blanco colonial, plaza e iglesia.',
    ],
    gastronomy: 'En Cachi: Ashpamanta u Oliver Café (terraza con vista a la plaza). Vinos de altura de la zona.',
    lodging_name: 'Cachi — El Cortijo Hotel Boutique / ACA Hostería', lodging_price: 90, lodging_notes: '',
    extra_costs: [{ label: 'Comida (2)', amount: 55 }, { label: 'Nafta', amount: 19 }],
    notes: 'Montaña con cornisa y ripio: manejá de día, despacio, prioridad para quien sube. Con nieve/hielo la Cuesta del Obispo se complica.',
  }),
  dayA(7, {
    title: 'Cachi → Cafayate', from_place: 'Cachi', to_place: 'Cafayate', distance_km: 160, drive_time: '4–5 h',
    terrain: 'Ripio (tramos)', max_altitude: 'Tramo más exigente', photo_url: IMG.flechas,
    activities: [
      'Bajar por la mítica Ruta 40 por los Valles Calchaquíes: Seclantás, Molinos y Angastaco.',
      'Quebrada de las Flechas: formaciones de roca puntiagudas inclinadas (monumento natural).',
      'Pasar por San Carlos y llegar a Cafayate, capital del Torrontés.',
      'Tarde: primera bodega (cata) y vuelta por la plaza.',
    ],
    gastronomy: 'Bad Brothers Wine Experience o El Rancho. Imperdible: el helado de vino (Torrontés/Cabernet) de la Heladería Miranda.',
    lodging_name: 'Cafayate — Hotel Killa / Viñas de Cafayate', lodging_price: 95, lodging_notes: '',
    extra_costs: [{ label: 'Comida (2)', amount: 60 }, { label: 'Nafta', amount: 19 }, { label: 'Cata de vinos', amount: 25 }],
    notes: 'El tramo más exigente (el que quisimos mantener). RN40 mayormente ripio, con badenes y poca señal/estaciones: salí con tanque lleno y temprano. En invierno puede haber hielo en sombras.',
  }),
  dayA(8, {
    title: 'Cafayate → Q. de las Conchas → Salta', from_place: 'Cafayate', to_place: 'Salta', distance_km: 185, drive_time: '3 h (5–6 h con paradas)',
    terrain: 'Asfalto', max_altitude: '', photo_url: IMG.conchas,
    activities: [
      'Mañana en Cafayate: una última bodega o el Museo de la Vid y el Vino.',
      'Quebrada de las Conchas (RN68): Garganta del Diablo, el Anfiteatro, los Castillos, el Sapo y las Ventanas.',
      'Llegada a Salta por la tarde/noche.',
    ],
    gastronomy: 'Antes de salir, una picada con vinos en Cafayate. En Salta, parrilla en La Tacita o El Charrúa.',
    lodging_name: 'Salta capital — vuelta para el cierre', lodging_price: 60, lodging_notes: '',
    extra_costs: [{ label: 'Comida (2)', amount: 55 }, { label: 'Nafta', amount: 22 }, { label: 'Bodega/Museo', amount: 20 }],
    notes: 'La luz de la tarde es la mejor para la Quebrada de las Conchas. Tomátela con calma, hay muchas paradas señalizadas.',
  }),
  dayA(9, {
    title: 'Salta · último día', from_place: 'Salta', to_place: 'Salta', distance_km: 20, drive_time: 'Día urbano',
    terrain: 'Mínimo manejo', max_altitude: '', photo_url: IMG.saltaPano,
    activities: [
      'Día relax: compras de artesanías y vinos (Mercado Artesanal y Mercado San Miguel).',
      'Pendientes: MAAM, Convento San Bernardo, café en la peatonal.',
      'Opcional: escapada a San Lorenzo (Quebrada de San Lorenzo, yungas) a 20 min.',
      'Dejar el auto listo y cargar nafta para arrancar mañana temprano.',
    ],
    gastronomy: 'Cierre a lo grande: José Balcarce (alta cocina regional) o despedida con empanadas en La Casona del Molino.',
    lodging_name: 'Salta capital — última noche', lodging_price: 60, lodging_notes: '',
    extra_costs: [{ label: 'Comida (2)', amount: 60 }, { label: 'Nafta', amount: 5 }],
    notes: '',
  }),
  dayA(10, {
    title: 'Salta → Córdoba', from_place: 'Salta', to_place: 'Córdoba', distance_km: 900, drive_time: '10–11 h',
    terrain: 'Asfalto · peajes', max_altitude: '', photo_url: IMG.cordoba,
    activities: [
      'Salida bien temprano por la Ruta 9 hacia el sur.',
      'Paradas para descansar y comer en Tucumán y Santiago del Estero.',
      'Llegada a Córdoba a la noche. Fin del recorrido. 🎉',
    ],
    gastronomy: 'En ruta: empanadas tucumanas o una parrilla sobre la RN9. Llevá agua, mate y snacks.',
    lodging_name: 'En casa 🏠 — fin del viaje', lodging_price: 0, lodging_notes: '',
    extra_costs: [{ label: 'Comida (2)', amount: 55 }, { label: 'Nafta', amount: 108 }, { label: 'Peajes', amount: 15 }],
    notes: 'Mismo criterio que la ida: turnarse, hidratarse y evitar el último tramo de noche.',
  }),
]
