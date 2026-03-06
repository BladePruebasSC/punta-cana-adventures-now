-- ============================================================
-- MIGRACIÓN: ELIMINAR IMÁGENES DUPLICADAS DEL TOUR SUPERIOR FAMILIAR
-- ============================================================
-- ESTA MIGRACIÓN ELIMINA TODAS LAS IMÁGENES DUPLICADAS
-- DEJANDO SOLO LA MÁS RECIENTE PARA CADA TOUR
-- ============================================================

-- PASO 1: VER CUÁNTAS IMÁGENES TIENE EL TOUR ANTES DE ELIMINAR
SELECT 
  COUNT(*) as total_imagenes,
  tour_id,
  (SELECT title FROM posts WHERE id = tour_images.tour_id) as tour_title
FROM tour_images
WHERE tour_id IN (
  SELECT id FROM posts WHERE title LIKE '%SUPERIOR FAMILIAR%'
)
GROUP BY tour_id;

-- PASO 2: ELIMINAR TODAS LAS IMÁGENES DUPLICADAS
-- Mantener SOLO la imagen más reciente (la última creada)
DELETE FROM tour_images
WHERE id IN (
  SELECT id FROM (
    SELECT 
      id,
      ROW_NUMBER() OVER (
        PARTITION BY tour_id 
        ORDER BY created_at DESC
      ) as rn
    FROM tour_images
    WHERE tour_id IN (
      SELECT id FROM posts WHERE title LIKE '%SUPERIOR FAMILIAR%'
    )
  ) t
  WHERE rn > 1
);

-- PASO 3: ACTUALIZAR LA IMAGEN RESTANTE PARA QUE SEA LA PRINCIPAL
UPDATE tour_images
SET 
  is_primary = true,
  order_index = 0
WHERE tour_id IN (
  SELECT id FROM posts WHERE title LIKE '%SUPERIOR FAMILIAR%'
);

-- PASO 4: VERIFICAR RESULTADO
SELECT 
  ti.id,
  ti.tour_id,
  ti.image_url,
  ti.is_primary,
  ti.order_index,
  ti.created_at,
  p.title as tour_title
FROM tour_images ti
JOIN posts p ON ti.tour_id = p.id
WHERE p.title LIKE '%SUPERIOR FAMILIAR%'
ORDER BY ti.created_at DESC;

-- PASO 5: CONTAR IMÁGENES FINALES POR TOUR
SELECT 
  p.title as tour_title,
  COUNT(ti.id) as total_imagenes
FROM posts p
LEFT JOIN tour_images ti ON p.id = ti.tour_id
WHERE p.title LIKE '%SUPERIOR FAMILIAR%'
GROUP BY p.title;

-- ============================================================
-- RESULTADO ESPERADO:
-- ============================================================
-- Después de ejecutar esta migración:
-- - El tour "BOOGIES KAYOS SUPERIOR FAMILIAR" tendrá SOLO 1 imagen
-- - Esa imagen será marcada como principal (is_primary = true)
-- - El order_index será 0
-- - Todas las imágenes duplicadas habrán sido eliminadas
-- ============================================================
