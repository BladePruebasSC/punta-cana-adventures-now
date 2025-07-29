-- Configuración de almacenamiento para imágenes
-- Crear bucket para imágenes del sitio
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-images',
  'site-images',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Crear bucket para imágenes de tours
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'tour-images',
  'tour-images',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Políticas para el bucket de imágenes del sitio
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'site-images');

CREATE POLICY "Authenticated users can upload site images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'site-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update site images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'site-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete site images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'site-images' 
  AND auth.role() = 'authenticated'
);

-- Políticas para el bucket de imágenes de tours
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'tour-images');

CREATE POLICY "Authenticated users can upload tour images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'tour-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update tour images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'tour-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete tour images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'tour-images' 
  AND auth.role() = 'authenticated'
); 