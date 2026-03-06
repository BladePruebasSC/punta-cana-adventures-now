-- ============================================================
-- SCRIPT DE CORRECCIÓN PARA LA BASE DE DATOS
-- Jon Tours Punta Cana
-- ============================================================
-- INSTRUCCIONES:
-- 1. Abre tu panel de Supabase (https://app.supabase.com)
-- 2. Ve a "SQL Editor"
-- 3. Copia y pega este script completo
-- 4. Haz clic en "Run" (Ejecutar)
-- ============================================================

-- 1. AGREGAR COLUMNA display_order A LA TABLA posts
-- Esta columna controla el orden en que aparecen los tours
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- 2. ASIGNAR display_order A TOURS EXISTENTES
-- Los tours más antiguos tendrán números más bajos
UPDATE posts
SET display_order = subquery.row_num
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) as row_num
  FROM posts
) AS subquery
WHERE posts.id = subquery.id
AND posts.display_order = 0;

-- 3. CREAR ÍNDICE PARA MEJORAR EL RENDIMIENTO
CREATE INDEX IF NOT EXISTS idx_posts_display_order ON posts(display_order);

-- 4. AGREGAR COMENTARIO DESCRIPTIVO
COMMENT ON COLUMN posts.display_order IS 'Orden de visualización del tour (menor número = primera posición)';

-- 5. VERIFICAR QUE LA TABLA tour_images EXISTE
-- Si no existe, crearla
CREATE TABLE IF NOT EXISTS tour_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tour_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. CREAR ÍNDICES PARA tour_images
CREATE INDEX IF NOT EXISTS idx_tour_images_tour_id ON tour_images(tour_id);
CREATE INDEX IF NOT EXISTS idx_tour_images_is_primary ON tour_images(is_primary);
CREATE INDEX IF NOT EXISTS idx_tour_images_order ON tour_images(order_index);

-- 7. AGREGAR COMENTARIOS A tour_images
COMMENT ON TABLE tour_images IS 'Almacena múltiples imágenes para cada tour';
COMMENT ON COLUMN tour_images.tour_id IS 'ID del tour al que pertenece la imagen';
COMMENT ON COLUMN tour_images.image_url IS 'URL de la imagen (puede ser de Supabase Storage, ImgBB o base64)';
COMMENT ON COLUMN tour_images.alt_text IS 'Texto alternativo para accesibilidad';
COMMENT ON COLUMN tour_images.is_primary IS 'Indica si es la imagen principal del tour';
COMMENT ON COLUMN tour_images.order_index IS 'Orden de visualización de la imagen en el carrusel';

-- 8. HABILITAR ROW LEVEL SECURITY (RLS) EN tour_images
ALTER TABLE tour_images ENABLE ROW LEVEL SECURITY;

-- 9. CREAR POLÍTICAS DE SEGURIDAD PARA tour_images
-- Primero eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "tour_images_select_policy" ON tour_images;
DROP POLICY IF EXISTS "tour_images_insert_policy" ON tour_images;
DROP POLICY IF EXISTS "tour_images_update_policy" ON tour_images;
DROP POLICY IF EXISTS "tour_images_delete_policy" ON tour_images;

-- Permitir lectura pública
CREATE POLICY "tour_images_select_policy" ON tour_images
  FOR SELECT
  USING (true);

-- Permitir inserción a todos (cambia según tus necesidades de seguridad)
CREATE POLICY "tour_images_insert_policy" ON tour_images
  FOR INSERT
  WITH CHECK (true);

-- Permitir actualización a todos (cambia según tus necesidades de seguridad)
CREATE POLICY "tour_images_update_policy" ON tour_images
  FOR UPDATE
  USING (true);

-- Permitir eliminación a todos (cambia según tus necesidades de seguridad)
CREATE POLICY "tour_images_delete_policy" ON tour_images
  FOR DELETE
  USING (true);

-- 10. VERIFICAR RESULTADO
-- Esta consulta te mostrará todos los tours con su display_order
SELECT 
  id, 
  title, 
  display_order,
  created_at,
  (SELECT COUNT(*) FROM tour_images WHERE tour_id = posts.id) as image_count
FROM posts
ORDER BY display_order ASC;

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
-- Si todo salió bien, verás una tabla con tus tours ordenados
-- y el conteo de imágenes para cada uno.
-- ============================================================
