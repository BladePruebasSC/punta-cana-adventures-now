// Sistema de caché simple para mejorar el rendimiento

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class SimpleCache {
  private cache = new Map<string, CacheItem<any>>();

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
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
}

// Cache instances for different data types
export const toursCache = new SimpleCache();
export const tourImagesCache = new SimpleCache();
export const siteSettingsCache = new SimpleCache();

// Cache keys
export const CACHE_KEYS = {
  TOURS: 'tours',
  TOUR_IMAGES: 'tour_images',
  SITE_SETTINGS: 'site_settings',
  TOUR_DETAIL: (id: string) => `tour_${id}`,
  TOUR_IMAGES_DETAIL: (id: string) => `tour_images_${id}`,
} as const;
