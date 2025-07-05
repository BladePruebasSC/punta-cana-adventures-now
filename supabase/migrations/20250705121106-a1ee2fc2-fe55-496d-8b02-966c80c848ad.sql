
-- Crear tabla para múltiples imágenes de tours
CREATE TABLE public.tour_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.tour_images ENABLE ROW LEVEL SECURITY;

-- Política permisiva para todos los usuarios
CREATE POLICY "Allow all operations on tour_images" ON public.tour_images FOR ALL USING (true);

-- Migrar imágenes existentes de posts a tour_images como imágenes principales
INSERT INTO public.tour_images (tour_id, image_url, alt_text, is_primary, order_index)
SELECT id, image_url, title, true, 0
FROM public.posts;

-- Agregar algunas imágenes adicionales para los tours existentes como ejemplo
INSERT INTO public.tour_images (tour_id, image_url, alt_text, is_primary, order_index)
SELECT 
  p.id,
  CASE 
    WHEN p.category = 'playa' THEN 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    WHEN p.category = 'aventura' THEN 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    WHEN p.category = 'cultura' THEN 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ELSE 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  END,
  'Imagen adicional del tour',
  false,
  1
FROM public.posts p;

-- Agregar una tercera imagen para cada tour
INSERT INTO public.tour_images (tour_id, image_url, alt_text, is_primary, order_index)
SELECT 
  p.id,
  CASE 
    WHEN p.category = 'playa' THEN 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    WHEN p.category = 'aventura' THEN 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    WHEN p.category = 'cultura' THEN 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ELSE 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  END,
  'Vista adicional del tour',
  false,
  2
FROM public.posts p;
