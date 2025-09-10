// Sistema de caché ultra-optimizado para velocidad máxima

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class SimpleCache {
  private cache = new Map<string, CacheItem<any>>();
  private maxSize = 500; // Aumentado significativamente

  set<T>(key: string, data: T, ttl: number = 30 * 24 * 60 * 60 * 1000): void { // 30 días por defecto
    // Limpiar caché si está lleno
    if (this.cache.size >= this.maxSize) {
      this.cleanup();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    return this.cache.has(key) && this.get(key) !== null;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  // Limpiar elementos expirados
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // Obtener estadísticas del caché
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      keys: Array.from(this.cache.keys())
    };
  }

  // Invalidar caché por patrón de clave
  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  // Forzar actualización de datos específicos
  forceRefresh(key: string): void {
    this.cache.delete(key);
  }
}

// Cache instances for different data types with ultra-long TTLs
export const toursCache = new SimpleCache();
export const tourImagesCache = new SimpleCache();
export const siteSettingsCache = new SimpleCache();
export const reservationsCache = new SimpleCache();
export const messagesCache = new SimpleCache();

// Cache keys
export const CACHE_KEYS = {
  TOURS: 'tours',
  TOUR_IMAGES: 'tour_images',
  SITE_SETTINGS: 'site_settings',
  RESERVATIONS: 'reservations',
  MESSAGES: 'messages',
  TOUR_DETAIL: (id: string) => `tour_${id}`,
  TOUR_IMAGES_DETAIL: (id: string) => `tour_images_${id}`,
} as const;

// TTL constants for maximum performance - TTLs extremadamente largos
export const CACHE_TTL = {
  TOURS: 30 * 24 * 60 * 60 * 1000, // 30 días
  TOUR_IMAGES: 30 * 24 * 60 * 60 * 1000, // 30 días
  SITE_SETTINGS: 90 * 24 * 60 * 60 * 1000, // 90 días
  RESERVATIONS: 5 * 60 * 1000, // 5 minutos (datos que cambian frecuentemente)
  MESSAGES: 5 * 60 * 1000, // 5 minutos (datos que cambian frecuentemente)
  TOUR_DETAIL: 30 * 24 * 60 * 60 * 1000, // 30 días
} as const;

// Funciones de utilidad para invalidar caché
export const invalidateCache = {
  // Invalidar todos los tours
  tours: () => {
    toursCache.forceRefresh(CACHE_KEYS.TOURS);
    toursCache.invalidatePattern('^tour_');
  },
  
  // Invalidar imágenes de tours
  tourImages: () => {
    tourImagesCache.forceRefresh(CACHE_KEYS.TOUR_IMAGES);
    tourImagesCache.invalidatePattern('^tour_images_');
  },
  
  // Invalidar configuraciones del sitio
  siteSettings: () => {
    siteSettingsCache.forceRefresh(CACHE_KEYS.SITE_SETTINGS);
  },
  
  // Invalidar un tour específico
  tour: (tourId: string) => {
    toursCache.forceRefresh(CACHE_KEYS.TOUR_DETAIL(tourId));
    tourImagesCache.forceRefresh(CACHE_KEYS.TOUR_IMAGES_DETAIL(tourId));
  },
  
  // Invalidar todo el caché
  all: () => {
    toursCache.clear();
    tourImagesCache.clear();
    siteSettingsCache.clear();
    reservationsCache.clear();
    messagesCache.clear();
  }
};
