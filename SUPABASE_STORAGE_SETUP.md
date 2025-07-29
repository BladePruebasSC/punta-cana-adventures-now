# Configuración de Supabase Storage

## Problema Actual
El componente de subida de imágenes actualmente usa base64 como solución temporal. Esto no es eficiente para imágenes grandes y puede causar problemas de rendimiento.

## Solución Recomendada: Supabase Storage

### 1. Configurar Buckets en Supabase Dashboard

1. Ve a tu proyecto de Supabase: https://supabase.com/dashboard/project/tmuwhjgqdomvqelvwhrs
2. Navega a **Storage** en el menú lateral
3. Crea dos buckets:
   - `site-images` (para imágenes del sitio)
   - `tour-images` (para imágenes de tours)

### 2. Configurar Políticas de Acceso

Para cada bucket, configura las siguientes políticas:

#### Política de Lectura Pública
```sql
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'site-images');
```

#### Política de Escritura para Usuarios Autenticados
```sql
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'site-images' 
  AND auth.role() = 'authenticated'
);
```

### 3. Aplicar Migración

Una vez configurado el dashboard, ejecuta:

```bash
npx supabase db push
```

### 4. Actualizar el Código

El código ya está preparado para usar Supabase Storage. Solo necesitas:

1. Configurar los buckets en el dashboard
2. Aplicar las políticas de acceso
3. Ejecutar la migración

### 5. Alternativas Temporales

Si no puedes configurar Supabase Storage inmediatamente, el código actual funciona con:

- **Base64**: Para imágenes pequeñas (< 5MB)
- **URLs externas**: Para imágenes ya hospedadas

### 6. Servicios de Hosting de Imágenes Alternativos

Si prefieres usar un servicio externo, puedes integrar:

- **ImgBB**: Gratuito, API simple
- **Cloudinary**: Más robusto, tiene plan gratuito
- **Firebase Storage**: Alternativa a Supabase

### 7. Configuración de ImgBB (Ejemplo)

```typescript
const uploadToImgBB = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await fetch('https://api.imgbb.com/1/upload?key=TU_API_KEY', {
    method: 'POST',
    body: formData
  });
  
  const data = await response.json();
  return data.data.url;
};
```

## Estado Actual

✅ **Funcional**: El componente de subida de imágenes funciona con base64
🔄 **Pendiente**: Configuración de Supabase Storage para mejor rendimiento
📝 **Nota**: Las imágenes se almacenan como strings base64 en la base de datos

## Próximos Pasos

1. Configurar Supabase Storage en el dashboard
2. Aplicar las políticas de acceso
3. Ejecutar la migración
4. Probar la funcionalidad completa 