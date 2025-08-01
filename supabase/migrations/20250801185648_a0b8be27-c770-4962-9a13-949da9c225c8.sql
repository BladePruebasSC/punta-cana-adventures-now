-- Insert detailed tour examples for Jon Tours and Adventure  
INSERT INTO posts (title, description, image_url, price, duration, rating, category, group_size, highlights, created_at) VALUES 
(
  'Isla Saona Paradise - Tour Completo',
  'Descubre la joya más preciada del Caribe dominicano en esta experiencia única de día completo. Navega en catamarán hacia la paradisíaca Isla Saona, parte del Parque Nacional del Este. Disfruta de aguas cristalinas color turquesa, playas de arena blanca como el talco, y la oportunidad de nadar con estrellas de mar en su hábitat natural. El tour incluye una deliciosa comida buffet con especialidades locales, bebidas ilimitadas, y tiempo libre para explorar las playas vírgenes. También visitaremos el pintoresco pueblo pesquero de Mano Juan, donde podrás conocer la cultura local auténtica.',
  '/placeholder.svg',
  95,
  '8-9 horas',
  4.9,
  'playa',
  'Hasta 150 personas',
  ARRAY['Transporte en catamarán y lancha rápida', 'Buffet criollo con langosta', 'Bebidas ilimitadas (ron, cerveza, refrescos)', 'Parada en piscina natural con estrellas de mar', 'Visita al pueblo Mano Juan', 'Guía bilingüe especializado', 'Equipo de snorkel incluido', 'Música en vivo y animación', 'Seguro de viaje incluido'],
  NOW()
),
(
  'Hoyo Azul y Scape Park Adventure',
  'Sumérgete en una aventura única en el corazón de la naturaleza dominicana. El Hoyo Azul es un cenote de aguas cristalinas color azul turquesa, rodeado de acantilados de piedra caliza y exuberante vegetación tropical. Esta excursión te llevará a través del Parque Ecológico Scape Park, donde podrás caminar por senderos naturales, observar flora y fauna endémica, y disfrutar de un refrescante baño en estas aguas sagradas para los taínos. La experiencia incluye tiempo para relajarse, tomar fotos espectaculares y aprender sobre la geología única de la región.',
  '/placeholder.svg',
  65,
  '4-5 horas',
  4.8,
  'naturaleza',
  'Hasta 20 personas',
  ARRAY['Entrada al Scape Park', 'Caminata guiada por senderos naturales', 'Baño en el cenote Hoyo Azul', 'Observación de flora y fauna', 'Fotografías profesionales incluidas', 'Refrescos y agua', 'Guía naturalista especializado', 'Transporte desde hoteles', 'Equipo de seguridad'],
  NOW()
),
(
  'Santo Domingo Colonial - Ciudad Patrimonio',
  'Viaja en el tiempo y descubre 500 años de historia en la primera ciudad del Nuevo Mundo. Este tour cultural te llevará por las calles empedradas de la Zona Colonial de Santo Domingo, declarada Patrimonio de la Humanidad por la UNESCO. Visitarás la primera catedral de América, el Alcázar de Colón, la Fortaleza Ozama, y caminarás por la Calle Las Damas, la primera calle pavimentada del continente. Conocerás las historias fascinantes de los conquistadores, piratas y corsarios que marcaron la historia del Caribe. Incluye almuerzo en restaurante típico y tiempo libre para compras.',
  '/placeholder.svg',
  85,
  '10-12 horas',
  4.7,
  'cultura',
  'Hasta 35 personas',
  ARRAY['Transporte en autobus con aire acondicionado', 'Tour guiado por la Zona Colonial', 'Entrada a Alcázar de Colón', 'Visita a la primera Catedral de América', 'Almuerzo típico dominicano', 'Tiempo libre para compras', 'Guía historiador especializado', 'Recorrido por Calle Las Damas', 'Fotos en lugares emblemáticos'],
  NOW()
),
(
  'Safari Aventura 4x4 - Selva Tropical',
  'Embárcate en una emocionante aventura 4x4 por los senderos más salvajes de la República Dominicana. Este safari te llevará a través de plantaciones de caña de azúcar, pueblos rurales auténticos, y la exuberante selva tropical donde podrás observar la vida silvestre en su hábitat natural. La experiencia incluye una visita a una cueva subterránea con formaciones de estalactitas y estalagmitas, un refrescante baño en un río de montaña, y la oportunidad de probar el famoso café y cacao dominicano directamente de las plantaciones locales. Una aventura perfecta para los amantes de la naturaleza y la adrenalina.',
  '/placeholder.svg',
  75,
  '6-7 horas',
  4.8,
  'aventura',
  'Hasta 16 personas',
  ARRAY['Vehículos 4x4 con conductor especializado', 'Exploración de cueva subterránea', 'Baño en río de montaña', 'Visita a plantación de café y cacao', 'Degustación de productos locales', 'Observación de vida silvestre', 'Almuerzo campestre', 'Equipo de seguridad incluido', 'Bebidas refrescantes'],
  NOW()
),
(
  'Catamarán Sunset - Fiesta en el Mar',
  'Disfruta de la puesta de sol más espectacular del Caribe dominicano a bordo de nuestro moderno catamarán. Esta experiencia única combina navegación, música, baile y diversión mientras contemplas como el sol se sumerge en el horizonte pintando el cielo de colores dorados y rosados. El tour incluye una parada para snorkel en un arrecife de coral, donde podrás descubrir la vida marina tropical. A bordo disfrutarás de una barra libre ilimitada con los mejores rones dominicanos, cervezas frías y cocteles tropicales, mientras nuestro DJ anima la fiesta con música latina y internacional.',
  '/placeholder.svg',
  55,
  '4 horas',
  4.9,
  'playa',
  'Hasta 80 personas',
  ARRAY['Navegación en catamarán moderno', 'Barra libre ilimitada', 'Snorkel en arrecife de coral', 'Música en vivo con DJ', 'Puesta de sol espectacular', 'Animación y baile', 'Snacks y aperitivos', 'Equipo de snorkel incluido', 'Fotografía profesional'],
  NOW()
),
(
  'Tirolinas Canopy - Vuelo entre las Copas',
  'Experimenta la adrenalina pura volando entre las copas de los árboles en el sistema de tirolinas más emocionante de Punta Cana. Con 12 líneas de diferentes longitudes y alturas, incluyendo la tirolina más larga de 800 metros, esta aventura te permitirá admirar la selva tropical desde una perspectiva única. El tour incluye un recorrido por puentes colgantes, una caminata interpretativa por senderos naturales, y la oportunidad de observar aves exóticas y otros animales en su hábitat natural. Perfecto para aventureros de todas las edades.',
  '/placeholder.svg',
  70,
  '3-4 horas',
  4.7,
  'aventura',
  'Hasta 24 personas',
  ARRAY['12 líneas de tirolinas diferentes', 'Tirolina de 800 metros', 'Puentes colgantes en las copas', 'Caminata interpretativa', 'Observación de aves exóticas', 'Equipo de seguridad profesional', 'Guías certificados', 'Refrescos incluidos', 'Fotos de la experiencia'],
  NOW()
),
(
  'Nado con Delfines - Experiencia Mágica',
  'Vive una experiencia única e inolvidable nadando y jugando con delfines en su hábitat semi-natural. En nuestro santuario marino, podrás interactuar de cerca con estos inteligentes mamíferos marinos bajo la supervisión de entrenadores profesionales. La experiencia incluye una sesión educativa sobre la conservación marina, tiempo de interacción directa con los delfines, y la oportunidad de nadar junto a ellos en una laguna de agua cristalina. Una actividad perfecta para familias que buscan crear recuerdos duraderos mientras aprenden sobre la importancia de proteger la vida marina.',
  '/placeholder.svg',
  120,
  '2-3 horas',
  4.9,
  'naturaleza',
  'Hasta 12 personas',
  ARRAY['Interacción directa con delfines', 'Sesión educativa sobre conservación', 'Entrenadores profesionales', 'Fotos y videos incluidos', 'Laguna de agua cristalina', 'Equipo de snorkel opcional', 'Certificado de participación', 'Refrescos incluidos', 'Transporte desde hoteles'],
  NOW()
),
(
  'Pueblo Mano Juan - Cultura Auténtica',
  'Descubre la vida auténtica del Caribe visitando Mano Juan, un pintoresco pueblo pesquero en la Isla Saona. Este tour cultural te permitirá conocer de primera mano las tradiciones, costumbres y el estilo de vida de los pescadores locales. Caminarás por sus coloridas calles, visitarás el pequeño cementerio local con su historia única, y tendrás la oportunidad de conversar con los lugareños que mantienen vivas las tradiciones ancestrales. La experiencia incluye una demostración de pesca tradicional, degustación de pescado fresco preparado al estilo local, y la compra de artesanías hechas a mano.',
  '/placeholder.svg',
  45,
  '3 horas',
  4.6,
  'cultura',
  'Hasta 25 personas',
  ARRAY['Visita al pueblo pesquero auténtico', 'Interacción con pescadores locales', 'Demostración de pesca tradicional', 'Degustación de pescado fresco', 'Compra de artesanías locales', 'Caminata por calles históricas', 'Visita al cementerio histórico', 'Guía local especializado', 'Transporte en bote incluido'],
  NOW()
);