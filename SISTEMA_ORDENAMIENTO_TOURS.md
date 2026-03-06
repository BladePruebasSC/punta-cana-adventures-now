# 🎯 Sistema de Ordenamiento de Tours - Instrucciones

## ✅ Cambios Realizados

He agregado funcionalidad completa para ordenar los tours en el Dashboard:

### 1. **Cambios en el Dashboard** (`src/pages/Dashboard.tsx`)

- ✅ Agregado campo `display_order` a la interfaz `Post`
- ✅ Agregados botones **"Subir"** y **"Bajar"** en cada tarjeta de tour
- ✅ Agregado badge que muestra la posición actual (#1, #2, #3, etc.)
- ✅ Las consultas ahora ordenan por `display_order` primero
- ✅ Al agregar un nuevo tour, se asigna automáticamente el siguiente número de orden

### 2. **Nuevas Funciones**

**`moveTourUp(tourId, currentOrder)`**: Mueve el tour una posición hacia arriba (intercambia con el tour anterior)

**`moveTourDown(tourId, currentOrder)`**: Mueve el tour una posición hacia abajo (intercambia con el siguiente tour)

### 3. **Migración de Base de Datos**

Archivo creado: `supabase/migrations/20250307000000_add_display_order_to_posts.sql`

Esta migración:
- Agrega el campo `display_order` a la tabla `posts`
- Asigna números de orden a los tours existentes basado en su fecha de creación
- Crea un índice para mejorar el rendimiento

---

## 🚀 Pasos para Aplicar los Cambios

### Opción 1: Aplicar Migración Manualmente en Supabase

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Ve a **SQL Editor**
3. Copia y pega el contenido del archivo `supabase/migrations/20250307000000_add_display_order_to_posts.sql`
4. Ejecuta el SQL
5. ¡Listo! Ya puedes usar el ordenamiento

### Opción 2: Usar Supabase CLI (si lo tienes instalado)

```powershell
# En la raíz del proyecto
supabase db push
```

---

## 📖 Cómo Usar el Sistema de Ordenamiento

### En el Dashboard:

1. **Ve a la pestaña "Tours"**
2. **Verás cada tour con un badge #1, #2, #3, etc.** que indica su posición actual
3. **Usa los botones:**
   - **"Subir" (↑)**: Mueve el tour una posición hacia arriba
   - **"Bajar" (↓)**: Mueve el tour una posición hacia abajo
4. **El orden se refleja inmediatamente** en la página principal

### En la Página Principal:

- Los tours se mostrarán en el orden que configuraste en el Dashboard
- El orden #1 aparece primero, luego #2, #3, etc.

---

## 🎨 Interfaz Visual

### Badge de Posición:
```
┌─────────────┐
│  #1  $150   │  ← Número de orden + Precio
│   Imagen    │
│    Tour     │
└─────────────┘
```

### Botones de Ordenar:
```
┌──────────┬──────────┐
│ ↑ Subir  │ ↓ Bajar  │
├──────────┴──────────┤
│ ✏️ Editar │ 🖼️ Imgs  │
│ 🗑️ Eliminar          │
└─────────────────────┘
```

---

## 🔍 Detalles Técnicos

### Campo `display_order`:
- **Tipo**: INTEGER
- **Default**: 0
- **Propósito**: Controlar el orden de visualización
- **Menor número = Primera posición**

### Comportamiento:
- Al crear un nuevo tour, se asigna automáticamente el siguiente número (max + 1)
- Al mover un tour arriba/abajo, se intercambian los números con el tour adyacente
- Si intentas mover el primer tour hacia arriba, muestra un mensaje
- Si intentas mover el último tour hacia abajo, muestra un mensaje

---

## ⚠️ Notas Importantes

1. **La migración es segura**: No afecta datos existentes, solo agrega una nueva columna
2. **Tours existentes**: Se les asigna automáticamente un orden basado en su fecha de creación
3. **Cache**: El cache se invalida automáticamente al cambiar el orden
4. **Performance**: Se agregó un índice para mantener las consultas rápidas

---

## 🎉 ¡Listo!

Una vez que apliques la migración, el sistema de ordenamiento estará completamente funcional.

**¿Necesitas ayuda?** Cualquier duda sobre cómo usar esta funcionalidad, pregúntame.
