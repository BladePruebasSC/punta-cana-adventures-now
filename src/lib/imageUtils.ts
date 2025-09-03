// Utilidades para optimización de imágenes

export const isValidImageUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

export const testImageUrl = async (url: string): Promise<boolean> => {
  if (!isValidImageUrl(url)) {
    return false;
  }

  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok && response.headers.get('content-type')?.startsWith('image/');
  } catch {
    return false;
  }
};

export const getImageFallback = (originalUrl: string): string => {
  // Si es una URL de Unsplash, intentar con parámetros diferentes
  if (originalUrl.includes('unsplash.com')) {
    const url = new URL(originalUrl);
    url.searchParams.set('w', '800');
    url.searchParams.set('q', '80');
    url.searchParams.set('fit', 'crop');
    return url.toString();
  }
  
  return '/placeholder.svg';
};

export const logImageLoadStatus = (url: string, success: boolean) => {
  console.log(`Image ${success ? 'loaded' : 'failed'}: ${url}`);
};

export const checkImageAccessibility = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

// Función para crear una URL de proxy simple (usando un servicio externo)
export const createProxyUrl = (originalUrl: string): string => {
  // Usar un servicio de proxy de imágenes como fallback
  return `https://images.weserv.nl/?url=${encodeURIComponent(originalUrl)}&w=800&q=80`;
};

// Función para obtener URLs de fallback de imágenes genéricas
export const getGenericFallbackImages = () => {
  return [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80'
  ];
};

// Función para optimizar URLs de Unsplash
export const optimizeUnsplashUrl = (url: string, width: number = 800, quality: number = 80): string => {
  if (!url.includes('unsplash.com')) return url;
  
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set('w', width.toString());
    urlObj.searchParams.set('q', quality.toString());
    urlObj.searchParams.set('fit', 'crop');
    urlObj.searchParams.set('auto', 'format');
    return urlObj.toString();
  } catch {
    return url;
  }
};

// Función para obtener el tamaño de imagen apropiado según el dispositivo
export const getResponsiveImageSize = (): { width: number; quality: number } => {
  const width = window.innerWidth;
  
  if (width < 640) return { width: 400, quality: 70 }; // Mobile
  if (width < 1024) return { width: 600, quality: 75 }; // Tablet
  return { width: 800, quality: 80 }; // Desktop
};

// Función para precargar imagen con timeout
export const preloadImageWithTimeout = (src: string, timeout: number = 5000): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    const timer = setTimeout(() => {
      resolve(false);
    }, timeout);

    img.onload = () => {
      clearTimeout(timer);
      resolve(true);
    };

    img.onerror = () => {
      clearTimeout(timer);
      resolve(false);
    };

    img.src = src;
  });
};

// Función para comprimir imagen en el cliente (si es posible)
export const compressImage = async (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          });
          resolve(compressedFile);
        } else {
          resolve(file);
        }
      }, file.type, quality);
    };

    img.src = URL.createObjectURL(file);
  });
};

// Función para verificar si una imagen está en caché del navegador
export const isImageCached = (src: string): boolean => {
  const img = new Image();
  img.src = src;
  return img.complete;
};

// Función para obtener estadísticas de carga de imágenes
export const getImageLoadStats = () => {
  const images = document.querySelectorAll('img');
  let loaded = 0;
  let failed = 0;
  let total = images.length;

  images.forEach(img => {
    if (img.complete && img.naturalHeight !== 0) {
      loaded++;
    } else if (img.complete) {
      failed++;
    }
  });

  return { loaded, failed, total, successRate: total > 0 ? (loaded / total) * 100 : 0 };
};

// Missing exports for SafeImage compatibility
export const checkUnsplashUrl = (url: string): boolean => {
  return url.includes('unsplash.com');
};

export const getAlternativeImageUrl = (originalUrl: string): string => {
  return getImageFallback(originalUrl);
};
