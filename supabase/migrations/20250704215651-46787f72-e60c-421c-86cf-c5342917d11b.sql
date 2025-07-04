
-- Crear tabla para posts/tours
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  duration TEXT NOT NULL,
  rating DECIMAL(2,1) DEFAULT 4.5,
  category TEXT NOT NULL,
  group_size TEXT NOT NULL,
  highlights TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla para reservas
CREATE TABLE public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id UUID REFERENCES public.posts(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date DATE NOT NULL,
  guests INTEGER NOT NULL,
  special_requests TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar datos de ejemplo (tours actuales)
INSERT INTO public.posts (title, description, image_url, price, duration, rating, category, group_size, highlights) VALUES
('Excursión a Saona Island', 'Descubre la isla más bella del Caribe dominicano con playas de arena blanca y aguas cristalinas.', 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 85.00, '8 horas', 4.8, 'playa', '2-15 personas', ARRAY['Almuerzo incluido', 'Snorkeling', 'Transporte']),
('Safari por la Selva Tropical', 'Aventura en 4x4 por senderos ocultos, cascadas secretas y pueblos auténticos.', 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 95.00, '6 horas', 4.9, 'aventura', '4-12 personas', ARRAY['Guía experto', 'Cascadas', 'Almuerzo típico']),
('Tour Cultural Santo Domingo', 'Explora la primera ciudad de América con arquitectura colonial y rica historia.', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 75.00, '10 horas', 4.7, 'cultura', '6-20 personas', ARRAY['Zona Colonial', 'Museos', 'Almuerzo']),
('Hoyo Azul & Scape Park', 'Cenote natural de aguas turquesas rodeado de naturaleza virgen.', 'https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 65.00, '4 horas', 4.6, 'naturaleza', '2-10 personas', ARRAY['Cenote único', 'Fotos profesionales', 'Refrescos']),
('Catamarán Sunset Premium', 'Navegación al atardecer con música en vivo, cena gourmet y barra libre.', 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 120.00, '5 horas', 4.9, 'playa', '2-30 personas', ARRAY['Barra libre', 'Cena gourmet', 'Música en vivo']),
('Tirolinas & Aventura Extrema', 'Adrenalina pura con 12 tirolinas sobre la copa de los árboles.', 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 89.00, '3 horas', 4.8, 'aventura', '2-8 personas', ARRAY['12 tirolinas', 'Equipo incluido', 'Certificado']);

-- Habilitar RLS (Row Level Security) - por ahora sin restricciones para simplificar
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Políticas permisivas para todos los usuarios (puedes ajustar según necesites)
CREATE POLICY "Allow all operations on posts" ON public.posts FOR ALL USING (true);
CREATE POLICY "Allow all operations on reservations" ON public.reservations FOR ALL USING (true);
