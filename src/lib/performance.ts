// Configuraciones de optimización de rendimiento

export const PERFORMANCE_CONFIG = {
  // Configuraciones de caché
  CACHE: {
    TOURS_TTL: 60 * 60 * 1000, // 1 hora
    IMAGES_TTL: 60 * 60 * 1000, // 1 hora
    SETTINGS_TTL: 24 * 60 * 60 * 1000, // 24 horas
    MAX_CACHE_SIZE: 100,
  },
  
  // Configuraciones de precarga de imágenes
  IMAGE_PRELOAD: {
    MAX_CONCURRENT: 3,
    TIMEOUT: 10000, // 10 segundos
    HIGH_PRIORITY_DELAY: 0,
    LOW_PRIORITY_DELAY: 2000, // 2 segundos
    MAX_PRELOAD_COUNT: 6,
  },
  
  // Configuraciones de lazy loading
  LAZY_LOADING: {
    ROOT_MARGIN: '50px',
    THRESHOLD: 0.1,
    HIGH_PRIORITY_ROOT_MARGIN: '0px',
  },
  
  // Configuraciones de optimización de imágenes
  IMAGE_OPTIMIZATION: {
    MOBILE_WIDTH: 400,
    TABLET_WIDTH: 600,
    DESKTOP_WIDTH: 800,
    MOBILE_QUALITY: 70,
    TABLET_QUALITY: 75,
    DESKTOP_QUALITY: 80,
    COMPRESSION_QUALITY: 0.8,
  },
  
  // Configuraciones de animaciones
  ANIMATIONS: {
    TRANSITION_DURATION: 300,
    HOVER_SCALE: 1.05,
    IMAGE_HOVER_SCALE: 1.1,
    LOADING_ANIMATION_DURATION: 1500,
  },
  
  // Configuraciones de red
  NETWORK: {
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
    REQUEST_TIMEOUT: 15000,
  }
} as const;

// Función para obtener configuración según el dispositivo
export const getDeviceConfig = () => {
  const width = window.innerWidth;
  
  if (width < 640) {
    return {
      imageWidth: PERFORMANCE_CONFIG.IMAGE_OPTIMIZATION.MOBILE_WIDTH,
      imageQuality: PERFORMANCE_CONFIG.IMAGE_OPTIMIZATION.MOBILE_QUALITY,
      maxConcurrent: 2,
    };
  } else if (width < 1024) {
    return {
      imageWidth: PERFORMANCE_CONFIG.IMAGE_OPTIMIZATION.TABLET_WIDTH,
      imageQuality: PERFORMANCE_CONFIG.IMAGE_OPTIMIZATION.TABLET_QUALITY,
      maxConcurrent: 3,
    };
  } else {
    return {
      imageWidth: PERFORMANCE_CONFIG.IMAGE_OPTIMIZATION.DESKTOP_WIDTH,
      imageQuality: PERFORMANCE_CONFIG.IMAGE_OPTIMIZATION.DESKTOP_QUALITY,
      maxConcurrent: 4,
    };
  }
};

// Función para optimizar URLs de imágenes según el dispositivo
export const optimizeImageUrl = (url: string): string => {
  if (!url || !url.includes('unsplash.com')) return url;
  
  try {
    const deviceConfig = getDeviceConfig();
    const urlObj = new URL(url);
    
    urlObj.searchParams.set('w', deviceConfig.imageWidth.toString());
    urlObj.searchParams.set('q', deviceConfig.imageQuality.toString());
    urlObj.searchParams.set('fit', 'crop');
    urlObj.searchParams.set('auto', 'format');
    
    return urlObj.toString();
  } catch {
    return url;
  }
};

// Función para medir el rendimiento
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`⏱️ ${name}: ${(end - start).toFixed(2)}ms`);
  return end - start;
};

// Función para optimizar el rendimiento de scroll
export const optimizeScroll = (callback: () => void, delay: number = 16) => {
  let ticking = false;
  
  return () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        callback();
        ticking = false;
      });
      ticking = true;
    }
  };
};

// Función para debounce
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Función para throttle
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Función para verificar si el dispositivo es lento
export const isSlowDevice = (): boolean => {
  const connection = (navigator as any).connection;
  if (connection) {
    return connection.effectiveType === 'slow-2g' || 
           connection.effectiveType === '2g' || 
           connection.effectiveType === '3g';
  }
  
  // Fallback: verificar memoria disponible
  const memory = (performance as any).memory;
  if (memory) {
    return memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8;
  }
  
  return false;
};

// Función para ajustar configuración según el dispositivo
export const getOptimizedConfig = () => {
  const isSlow = isSlowDevice();
  const deviceConfig = getDeviceConfig();
  
  return {
    ...PERFORMANCE_CONFIG,
    IMAGE_PRELOAD: {
      ...PERFORMANCE_CONFIG.IMAGE_PRELOAD,
      MAX_CONCURRENT: isSlow ? 1 : deviceConfig.maxConcurrent,
      MAX_PRELOAD_COUNT: isSlow ? 3 : PERFORMANCE_CONFIG.IMAGE_PRELOAD.MAX_PRELOAD_COUNT,
    },
    IMAGE_OPTIMIZATION: {
      ...PERFORMANCE_CONFIG.IMAGE_OPTIMIZATION,
      MOBILE_QUALITY: isSlow ? 60 : PERFORMANCE_CONFIG.IMAGE_OPTIMIZATION.MOBILE_QUALITY,
      TABLET_QUALITY: isSlow ? 65 : PERFORMANCE_CONFIG.IMAGE_OPTIMIZATION.TABLET_QUALITY,
      DESKTOP_QUALITY: isSlow ? 70 : PERFORMANCE_CONFIG.IMAGE_OPTIMIZATION.DESKTOP_QUALITY,
    }
  };
};
