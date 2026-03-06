-- Agregar campo display_order a la tabla posts para controlar el orden de visualización
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Asignar display_order basado en created_at para tours existentes
UPDATE posts 
SET display_order = subquery.row_num
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) as row_num
  FROM posts
) AS subquery
WHERE posts.id = subquery.id
AND posts.display_order = 0;

-- Crear índice para mejorar el rendimiento al ordenar
CREATE INDEX IF NOT EXISTS idx_posts_display_order ON posts(display_order);

-- Comentario descriptivo
COMMENT ON COLUMN posts.display_order IS 'Orden de visualización del tour (menor número = primera posición)';
