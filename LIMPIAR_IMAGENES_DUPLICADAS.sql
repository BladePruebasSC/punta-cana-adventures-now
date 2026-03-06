-- ============================================================
-- SCRIPT PARA LIMPIAR IMÁGENES DUPLICADAS
-- ============================================================
-- EJECUTA ESTE SCRIPT EN SUPABASE SQL EDITOR
-- ============================================================

-- 1. VER TODAS LAS IMÁGENES DUPLICADAS (VERIFICACIÓN)
SELECT 
  tour_id,
  image_url,
  COUNT(*) as count
FROM tour_images
GROUP BY tour_id, image_url
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- 2. VER TODAS LAS IMÁGENES CON DETALLES
SELECT 
  id,
  tour_id,
  image_url,
  is_primary,
  order_index,
  created_at,
  (SELECT title FROM posts WHERE id = tour_images.tour_id) as tour_title
FROM tour_images
ORDER BY tour_id, order_index, created_at;

-- 3. ELIMINAR DUPLICADOS MANTENIENDO SOLO LA MÁS RECIENTE
-- CUIDADO: Este script elimina las imágenes duplicadas
-- Descomenta las siguientes líneas SOLO si estás seguro

/*
DELETE FROM tour_images a
USING tour_images b
WHERE a.id < b.id
  AND a.tour_id = b.tour_id
  AND a.image_url = b.image_url;
*/

-- 4. RESTABLECER LOS order_index PARA QUE SEAN CONSECUTIVOS
-- Descomenta las siguientes líneas SOLO si estás seguro

/*
WITH ranked_images AS (
  SELECT 
    id,
    tour_id,
    ROW_NUMBER() OVER (PARTITION BY tour_id ORDER BY order_index, created_at) - 1 as new_order
  FROM tour_images
)
UPDATE tour_images
SET order_index = ranked_images.new_order
FROM ranked_images
WHERE tour_images.id = ranked_images.id;
*/

-- 5. VERIFICAR RESULTADO FINAL
SELECT 
  tour_id,
  COUNT(*) as image_count,
  (SELECT title FROM posts WHERE id = tour_images.tour_id) as tour_title
FROM tour_images
GROUP BY tour_id
ORDER BY image_count DESC;

-- ============================================================
-- INSTRUCCIONES:
-- ============================================================
-- 1. Primero ejecuta las consultas SELECT (pasos 1, 2 y 5)
-- 2. Revisa los resultados
-- 3. Si ves duplicados, descomenta el paso 3 y ejecútalo
-- 4. Si los order_index están desordenados, descomenta el paso 4
-- 5. Vuelve a ejecutar el paso 5 para verificar
-- ============================================================
