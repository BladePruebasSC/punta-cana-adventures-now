# 🔧 GUÍA DE SOLUCIÓN: Problemas con Imágenes y Ordenamiento

## 📋 Problemas Identificados

### 1. **Error 400 en consultas de posts**
- **Causa**: La columna `display_order` no existe en la tabla `posts`
- **Síntoma**: Error en consola: `Failed to load resource: the server responded with a status of 400`

### 2. **Imágenes no se suben correctamente**
- **Causa**: Configuración de Supabase Storage y API keys inválidas
- **Síntoma**: Las imágenes se convierten a base64 (muy pesadas) en lugar de subirse al servidor

### 3. **8 imágenes repetidas en página de reserva**
- **Causa**: Problema en la tabla `tour_images` que no está configurada correctamente
- **Síntoma**: Se muestra 8 veces la misma imagen en el carrusel

---

## ✅ SOLUCIÓN PASO A PASO

### PASO 1: Aplicar el script de corrección de base de datos

1. **Abre tu panel de Supabase**
   - Ve a https://app.supabase.com
   - Selecciona tu proyecto "punta-cana-adventures-now"

2. **Ve al SQL Editor**
   - En el menú lateral izquierdo, haz clic en "SQL Editor"
   - Haz clic en "+ New Query"

3. **Ejecuta el script**
   - Abre el archivo `SOLUCION_BASE_DATOS.sql` que está en la raíz de tu proyecto
   - Copia TODO el contenido del archivo
   - Pégalo en el editor SQL de Supabase
   - Haz clic en el botón "Run" o presiona `Ctrl+Enter` / `Cmd+Enter`

4. **Verifica el resultado**
   - Al final del script, verás una tabla con tus tours
   - Verifica que cada tour tiene un número en la columna `display_order`
   - Verifica que `image_count` muestra cuántas imágenes tiene cada tour

### PASO 2: Verificar Storage de Supabase

1. **Ve a Storage en Supabase**
   - En el menú lateral, haz clic en "Storage"

2. **Verifica los buckets**
   - Busca dos buckets llamados:
     - `site-images`
     - `tour-images`
   
3. **Si NO existen, créalos**:
   
   **Para `site-images`:**
   - Haz clic en "New bucket"
   - Nombre: `site-images`
   - Public bucket: ✅ (marcado)
   - Haz clic en "Create bucket"

   **Para `tour-images`:**
   - Haz clic en "New bucket"
   - Nombre: `tour-images`
   - Public bucket: ✅ (marcado)
   - Haz clic en "Create bucket"

4. **Configurar políticas de acceso**:
   
   Para cada bucket (`site-images` y `tour-images`):
   - Haz clic en el bucket
   - Ve a la pestaña "Policies"
   - Si no hay políticas, haz clic en "New policy"
   
   **Política de lectura pública:**
   ```
   Policy name: Public Access
   Policy definition: SELECT
   Target roles: public
   USING expression: true
   ```
   
   **Política de inserción:**
   ```
   Policy name: Authenticated Insert
   Policy definition: INSERT
   Target roles: authenticated
   WITH CHECK expression: true
   ```

### PASO 3: Reactivar las funciones de ordenamiento

Una vez que hayas aplicado el script SQL:

1. **Abre el archivo**: `src/pages/Dashboard.tsx`

2. **Busca las funciones `moveTourUp` y `moveTourDown`**
   - Están alrededor de las líneas 776 y 823

3. **Elimina los comentarios temporales**:
   - Elimina la línea que dice `toast({ title: "Función deshabilitada"...`
   - Descomenta todo el código entre `/* TEMPORALMENTE DESHABILITADO` y `*/`

4. **Busca la función `handleAddPost`**
   - Está alrededor de la línea 587

5. **Descomenta el código de display_order**:
   - Descomenta las líneas:
     ```typescript
     const maxOrder = posts.length > 0 ? Math.max(...posts.map(p => p.display_order || 0)) : 0;
     const nextOrder = maxOrder + 1;
     ```
   - Descomenta la línea:
     ```typescript
     display_order: nextOrder
     ```

### PASO 4: Restaurar las consultas con display_order

1. **En `src/pages/Dashboard.tsx` (línea 233)**:
   
   **Cambiar de:**
   ```typescript
   supabase.from('posts').select('*').order('created_at', { ascending: false }),
   ```
   
   **A:**
   ```typescript
   supabase.from('posts').select('*').order('display_order', { ascending: true }).order('created_at', { ascending: false }),
   ```

2. **En `src/pages/Index.tsx` (líneas 297-298)**:
   
   **Cambiar de:**
   ```typescript
   .select('id, title, description, price, duration, category, image_url, rating, group_size, highlights')
   .order('created_at', { ascending: false });
   ```
   
   **A:**
   ```typescript
   .select('id, title, description, price, duration, category, image_url, rating, group_size, highlights, display_order')
   .order('display_order', { ascending: true })
   .order('created_at', { ascending: false });
   ```

---

## 🧪 VERIFICAR QUE TODO FUNCIONA

### 1. Verificar el ordenamiento:
- Ve al Dashboard
- Deberías ver botones ↑ y ↓ junto a cada tour
- Prueba mover un tour hacia arriba o abajo
- Verifica que se actualiza el orden

### 2. Verificar la subida de imágenes:
- Intenta agregar un nuevo tour con una imagen
- La imagen debería subirse sin errores
- Ve a Supabase Storage → `tour-images` y verifica que la imagen está allí

### 3. Verificar las imágenes en la página de reserva:
- Ve a la página principal
- Haz clic en "Reservar" en cualquier tour
- Verifica que el carrusel muestra las imágenes correctamente
- Si hay múltiples imágenes, deberías poder navegar entre ellas

---

## 🆘 SI ALGO SALE MAL

### Si el script SQL falla:
1. Lee el mensaje de error
2. Es posible que alguna tabla ya tenga la columna o el índice
3. Eso es normal - puedes ignorar esos errores

### Si las imágenes siguen sin subirse:
1. Verifica que los buckets de Storage estén públicos
2. Verifica las políticas de seguridad
3. Revisa la consola del navegador para ver qué error específico aparece

### Si sigues viendo 8 imágenes repetidas:
1. Ve al Dashboard
2. Selecciona el tour problemático
3. Haz clic en "Gestionar Imágenes"
4. Elimina las imágenes duplicadas
5. Sube nuevas imágenes

---

## 📝 RESUMEN

Los cambios temporales que hice al código **DEBEN REVERTIRSE** después de aplicar el script SQL:

1. ✅ Aplica `SOLUCION_BASE_DATOS.sql` en Supabase
2. ✅ Configura los buckets de Storage
3. ✅ Descomenta las funciones de ordenamiento en `Dashboard.tsx`
4. ✅ Restaura las consultas con `display_order` en `Dashboard.tsx` e `Index.tsx`
5. ✅ Prueba que todo funcione

---

## 🎯 RESULTADO ESPERADO

Después de seguir todos los pasos:
- ✅ Los tours se pueden ordenar con botones ↑ y ↓
- ✅ Las imágenes se suben correctamente a Supabase Storage
- ✅ El carrusel muestra las imágenes correctas (no 8 veces la misma)
- ✅ No hay errores 400 o 406 en la consola

---

¿Necesitas ayuda con algún paso específico? ¡Pregúntame!
