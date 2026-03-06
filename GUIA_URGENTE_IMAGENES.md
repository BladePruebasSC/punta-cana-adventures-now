# 🔧 SOLUCIÓN URGENTE: Imágenes Duplicadas y No Visibles

## 🚨 PROBLEMA ACTUAL

1. **Dashboard**: Las imágenes NO se muestran
2. **Página de Reserva**: La imagen se repite 8 veces
3. **Base de datos**: Probablemente hay imágenes duplicadas

---

## ✅ SOLUCIÓN INMEDIATA (3 PASOS)

### PASO 1: Limpiar Base de Datos

1. Abre Supabase (https://app.supabase.com)
2. Ve a "SQL Editor"
3. Abre el archivo `LIMPIAR_IMAGENES_DUPLICADAS.sql`
4. Copia y pega **TODO EL SCRIPT**
5. Haz clic en "Run"
6. Revisa los resultados

**Lo que verás:**
- Una lista de tours con el conteo de imágenes
- Si algún tour tiene más de 1-3 imágenes, hay un problema
- Si ves filas con `count > 1`, hay duplicados

**Si hay duplicados:**
1. En el script, encuentra la sección que dice:
   ```sql
   /* DELETE FROM tour_images a ... */
   ```
2. Quita los `/*` y `*/` para descomentar
3. Ejecuta el script nuevamente
4. Esto eliminará los duplicados

### PASO 2: Limpiar Caché del Navegador

**Opción A - Recarga Forzada:**
1. Presiona `Ctrl + Shift + R` (Windows) o `Cmd + Shift + R` (Mac)
2. Esto recarga la página ignorando el caché

**Opción B - Limpiar Todo:**
1. Presiona `F12` para abrir DevTools
2. Ve a la pestaña "Application" (Chrome) o "Storage" (Firefox)
3. En el panel izquierdo, busca "Storage"
4. Haz clic derecho en tu sitio
5. Selecciona "Clear site data"
6. Confirma

### PASO 3: Verificar Resultados

1. Recarga el Dashboard (`Ctrl + R`)
2. Ve al apartado de tours
3. Haz clic en "Gestionar Imágenes" en cualquier tour
4. Deberías ver las imágenes correctamente

**Si sigues sin ver imágenes en el Dashboard:**
- Las imágenes están en la base de datos pero el código no las carga
- Revisa la consola del navegador (F12 → Console)
- Busca mensajes como "Tour images loaded:"
- Si dice "0 images", entonces no hay imágenes para ese tour

---

## 🔍 VERIFICAR QUE TODO ESTÁ BIEN

### En Supabase:

1. Ve a "Table Editor"
2. Selecciona la tabla `tour_images`
3. Busca el tour problemático (por `tour_id`)
4. Deberías ver:
   - Solo 1 fila por cada imagen diferente
   - `order_index` comenzando en 0, 1, 2, etc.
   - Una sola imagen con `is_primary = true`

### En el Dashboard:

1. Ve a "Tours"
2. Haz clic en "Gestionar Imágenes"
3. Deberías ver:
   - La imagen principal en la sección "Imagen Principal"
   - Las imágenes adicionales en "Imágenes Adicionales"
   - No debería haber duplicados

### En la Página de Reserva:

1. Haz clic en "Reservar" en cualquier tour
2. Deberías ver:
   - Un carrusel con todas las imágenes
   - Botones de navegación (← →) si hay más de 1 imagen
   - Cada imagen debe aparecer UNA SOLA VEZ

---

## 🛠️ CAMBIOS QUE HICE EN EL CÓDIGO

1. **Simplificado la carga de imágenes en Dashboard**:
   - Eliminado código complejo que cargaba imágenes dos veces
   - Ahora carga una sola vez de forma secuencial
   - Mejor manejo de errores

2. **Forzado recarga de imágenes en Reservar**:
   - Siempre limpia el caché al entrar
   - Detecta y filtra imágenes duplicadas automáticamente
   - Logs detallados para debugging

3. **TTL de caché reducido**:
   - De 30 días a 5 minutos
   - Los cambios se reflejan mucho más rápido

---

## 🆘 SI SIGUE SIN FUNCIONAR

1. **Envíame screenshots de:**
   - La tabla `tour_images` en Supabase filtrada por el tour problemático
   - La consola del navegador (F12 → Console)
   - El diálogo "Gestionar Imágenes" en el Dashboard

2. **Envíame el resultado de esta consulta en Supabase:**
   ```sql
   SELECT 
     id,
     tour_id,
     image_url,
     is_primary,
     order_index,
     created_at,
     (SELECT title FROM posts WHERE id = tour_images.tour_id) as tour_title
   FROM tour_images
   ORDER BY tour_id, order_index;
   ```

3. **Intenta agregar una imagen nueva:**
   - Ve al Dashboard
   - Selecciona un tour
   - Haz clic en "Gestionar Imágenes"
   - Agrega una imagen nueva
   - Verifica si aparece en el Dashboard
   - Verifica si aparece en la página de Reserva

---

## 📝 RESUMEN DE ARCHIVOS MODIFICADOS

- `src/pages/Dashboard.tsx` - Carga simplificada de imágenes
- `src/pages/Reservar.tsx` - Detección de duplicados y recarga forzada
- `src/lib/cache.ts` - TTL reducido
- `LIMPIAR_IMAGENES_DUPLICADAS.sql` - Script para limpiar BD
- Este archivo - Guía de solución

---

**¿Necesitas más ayuda?** Avísame y seguiré depurando el problema. 🔍
