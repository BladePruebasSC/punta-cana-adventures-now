-- Arreglar políticas de almacenamiento para permitir subida sin autenticación
-- Eliminar políticas existentes que requieren autenticación

-- Eliminar políticas existentes para site-images
DROP POLICY IF EXISTS "Authenticated users can upload site images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update site images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete site images" ON storage.objects;

-- Eliminar políticas existentes para tour-images
DROP POLICY IF EXISTS "Authenticated users can upload tour images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update tour images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete tour images" ON storage.objects;

-- Crear nuevas políticas que permiten acceso público completo
CREATE POLICY "Public upload access for site images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'site-images');

CREATE POLICY "Public update access for site images" ON storage.objects
FOR UPDATE USING (bucket_id = 'site-images');

CREATE POLICY "Public delete access for site images" ON storage.objects
FOR DELETE USING (bucket_id = 'site-images');

CREATE POLICY "Public upload access for tour images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'tour-images');

CREATE POLICY "Public update access for tour images" ON storage.objects
FOR UPDATE USING (bucket_id = 'tour-images');

CREATE POLICY "Public delete access for tour images" ON storage.objects
FOR DELETE USING (bucket_id = 'tour-images'); 