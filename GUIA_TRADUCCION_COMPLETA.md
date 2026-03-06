# 🌐 GUÍA COMPLETA: Sistema de Traducción Centralizado

## ✅ LO QUE YA HICE:

### 1. **Creado el Contexto de Idioma Global** (`src/contexts/LanguageContext.tsx`)
- ✅ Archivo creado con todas las traducciones centralizadas
- ✅ Soporte para Español e Inglés
- ✅ Guarda el idioma preferido en localStorage
- ✅ Hook `useLanguage()` para usar en cualquier componente

### 2. **Actualizado App.tsx**
- ✅ Envuelto toda la aplicación con `<LanguageProvider>`
- ✅ Ahora TODAS las páginas tienen acceso al sistema de idiomas

---

## 📋 LO QUE FALTA HACER:

### Paso 1: Actualizar Index.tsx

En `src/pages/Index.tsx`:

1. **Importar el hook** al inicio del archivo:
```typescript
import { useLanguage } from '@/contexts/LanguageContext';
```

2. **Reemplazar el sistema local** (líneas ~180-190):
```typescript
// ELIMINAR estas líneas:
const [currentLanguage, setCurrentLanguage] = useState('es');
const t = useMemo(() => {
  return translations[currentLanguage as keyof typeof translations] || translations.es;
}, [currentLanguage]);

// REEMPLAZAR con:
const { language: currentLanguage, setLanguage: setCurrentLanguage, t } = useLanguage();
```

3. **Eliminar las traducciones locales** (líneas ~24-148):
```typescript
// ELIMINAR todo el objeto 'translations' que está definido localmente
// Ya está en el contexto global
```

### Paso 2: Actualizar Reservar.tsx

En `src/pages/Reservar.tsx`, agregar al inicio (después de los imports):

```typescript
import { useLanguage } from '@/contexts/LanguageContext';

// Dentro del componente Reservar:
const { language, setLanguage, t } = useLanguage();
```

Luego reemplazar TODOS los textos hardcodeados con `t.clave`:

**Ejemplos:**
- `"Volver"` → `{t.backButton}`
- `"Reservar Ahora"` → `{t.reserveNow}`
- `"Nombre Completo"` → `{t.fullName}`
- `"Email"` → `{t.email}`
- `"Teléfono"` → `{t.phone}`
- `"Fecha Preferida"` → `{t.preferredDate}`
- `"Número de Huéspedes"` → `{t.numberOfGuests}`
- `"Solicitudes Especiales"` → `{t.specialRequests}`
- etc.

### Paso 3: Actualizar TransportationSection.tsx

En `src/components/TransportationSection.tsx`:

```typescript
import { useLanguage } from '@/contexts/LanguageContext';

const TransportationSection = () => {
  const { t } = useLanguage();
  
  // Reemplazar textos:
  // "Servicio de Transporte" → {t.transportTitle}
  // "Traslados seguros..." → {t.transportSubtitle}
  // "Traslado Aeropuerto" → {t.airportTransfer}
  // etc.
}
```

### Paso 4: Actualizar Nosotros.tsx

En `src/pages/Nosotros.tsx`:

```typescript
import { useLanguage } from '@/contexts/LanguageContext';

const Nosotros = () => {
  const { language, setLanguage, t } = useLanguage();
  
  // Agregar botón de idioma en el header (copiar del Index.tsx)
  // Reemplazar TODOS los textos hardcodeados
}
```

### Paso 5: Actualizar Contacto.tsx

En `src/pages/Contacto.tsx`:

```typescript
import { useLanguage } from '@/contexts/LanguageContext';

const Contacto = () => {
  const { language, setLanguage, t } = useLanguage();
  
  // Agregar botón de idioma en el header (copiar del Index.tsx)
  // Reemplazar TODOS los textos hardcodeados
}
```

---

## 🎯 PATRONES DE REEMPLAZO COMUNES:

### Botones de acción:
```typescript
// Antes:
<Button>Reservar Ahora</Button>

// Después:
<Button>{t.reserveNow}</Button>
```

### Labels de formulario:
```typescript
// Antes:
<Label>Nombre Completo</Label>

// Después:
<Label>{t.fullName}</Label>
```

### Placeholders:
```typescript
// Antes:
<Input placeholder="Tu nombre completo" />

// Después:
<Input placeholder={t.yourName} />
```

### Títulos y subtítulos:
```typescript
// Antes:
<h1>Sobre Nosotros</h1>

// Después:
<h1>{t.aboutTitle}</h1>
```

---

## 🔧 CÓMO AGREGAR NUEVAS TRADUCCIONES:

Si encuentras un texto que NO está traducido:

1. Abre `src/contexts/LanguageContext.tsx`
2. Agrega la clave en AMBOS idiomas (es y en):

```typescript
const translations = {
  es: {
    // ... traducciones existentes
    nuevoTexto: "Texto en español",
  },
  en: {
    // ... traducciones existentes  
    nuevoTexto: "Text in English",
  }
};
```

3. Úsalo en tu componente: `{t.nuevoTexto}`

---

## 🎨 BOTÓN DE IDIOMA (Copia este código):

Para agregar el selector de idioma en cualquier header:

```typescript
// Desktop
<div className="relative group">
  <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors text-sm xl:text-base px-3 py-2 rounded-lg hover:bg-blue-50">
    <Globe className="w-4 h-4" />
    <span className="font-medium">{language.toUpperCase()}</span>
  </button>
  <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
    <button
      onClick={() => setLanguage('es')}
      className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors rounded-t-lg ${language === 'es' ? 'bg-blue-100 text-blue-600 font-bold' : 'text-gray-700'}`}
    >
      🇪🇸 Español
    </button>
    <button
      onClick={() => setLanguage('en')}
      className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors rounded-b-lg ${language === 'en' ? 'bg-blue-100 text-blue-600 font-bold' : 'text-gray-700'}`}
    >
      🇺🇸 English
    </button>
  </div>
</div>

// Mobile
<button 
  onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50"
>
  <Globe className="w-4 h-4" />
  <span className="text-xs font-bold">{language.toUpperCase()}</span>
</button>
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN:

- [ ] Actualizar Index.tsx para usar el contexto global
- [ ] Actualizar Reservar.tsx con traducciones
- [ ] Actualizar TransportationSection.tsx
- [ ] Actualizar Nosotros.tsx con botón de idioma y traducciones
- [ ] Actualizar Contacto.tsx con botón de idioma y traducciones
- [ ] Agregar botón de idioma en headers de todas las páginas
- [ ] Probar cambio de idioma en cada página
- [ ] Verificar que TODO el texto cambie al cambiar idioma
- [ ] Verificar que el idioma se mantenga al navegar entre páginas

---

## 🚀 RESULTADO FINAL:

Cuando termines, tendrás:
- ✅ **UN SOLO** sistema de traducciones para TODA la aplicación
- ✅ Botón de idioma en TODAS las páginas
- ✅ El idioma se mantiene al navegar (guardado en localStorage)
- ✅ TODOS los textos traducidos (español ↔ inglés)
- ✅ Código más limpio y mantenible

---

¿Necesitas ayuda con alguna página específica? Dime cuál y te ayudo a traducirla completamente. 🌎
