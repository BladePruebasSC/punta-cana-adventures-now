// Utilidades para manejo de imágenes

export const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

export const testImageUrl = async (url: string): Promise<boolean> => {
  if (!isValidImageUrl(url)) return false;
  
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      mode: 'cors'
    });
    
    if (!response.ok) {
      console.error(`Image URL test failed for ${url}:`, response.status, response.statusText);
      return false;
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      console.error(`URL does not point to an image: ${url}, content-type: ${contentType}`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error testing image URL ${url}:`, error);
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
  if (success) {
    console.log(`✅ Image loaded successfully: ${url}`);
  } else {
    console.error(`❌ Image failed to load: ${url}`);
  }
};

// Función para verificar si una imagen está siendo bloqueada por CORS
export const checkImageAccessibility = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      mode: 'no-cors' // Esto evita errores de CORS
    });
    return true;
  } catch (error) {
    console.error('Image accessibility check failed:', error);
    return false;
  }
};

// Función para crear una URL de proxy simple (usando un servicio externo)
export const createProxyUrl = (originalUrl: string): string => {
  // Usar un servicio de proxy de imágenes como fallback
  return `https://images.weserv.nl/?url=${encodeURIComponent(originalUrl)}&w=800&q=80`;
};

// Función para obtener URLs de fallback de imágenes genéricas
export const getGenericFallbackImages = (): string[] => {
  return [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  ];
};

// Función para verificar si una URL de Unsplash está siendo bloqueada
export const checkUnsplashUrl = (url: string): string => {
  if (!url.includes('unsplash.com')) return url;
  
  try {
    const urlObj = new URL(url);
    
    // Asegurar que tenga los parámetros correctos para evitar problemas de CORS
    urlObj.searchParams.set('auto', 'format');
    urlObj.searchParams.set('fit', 'crop');
    urlObj.searchParams.set('w', '800');
    urlObj.searchParams.set('q', '80');
    
    return urlObj.toString();
  } catch (error) {
    console.error('Error processing Unsplash URL:', error);
    return url;
  }
};

// Función para obtener una URL de imagen alternativa si la original falla
export const getAlternativeImageUrl = (originalUrl: string): string => {
  if (originalUrl.includes('unsplash.com')) {
    try {
      // Intentar con diferentes parámetros
      const url = new URL(originalUrl);
      url.searchParams.set('auto', 'format');
      url.searchParams.set('fit', 'crop');
      url.searchParams.set('w', '600');
      url.searchParams.set('q', '70');
      return url.toString();
    } catch (error) {
      console.error('Error processing Unsplash URL:', error);
      return originalUrl;
    }
  }
  
  // Si no es Unsplash, usar una imagen de placeholder
  return '/placeholder.svg';
};

// Función para obtener múltiples URLs alternativas
export const getMultipleAlternativeUrls = (originalUrl: string): string[] => {
  const alternatives: string[] = [];
  
  if (originalUrl.includes('unsplash.com')) {
    try {
      // Alternativa 1: Parámetros básicos
      const basicUrl = new URL(originalUrl);
      basicUrl.searchParams.set('w', '800');
      basicUrl.searchParams.set('q', '80');
      alternatives.push(basicUrl.toString());
      
      // Alternativa 2: Parámetros diferentes
      const altUrl = new URL(originalUrl);
      altUrl.searchParams.set('auto', 'format');
      altUrl.searchParams.set('fit', 'crop');
      altUrl.searchParams.set('w', '600');
      altUrl.searchParams.set('q', '70');
      alternatives.push(altUrl.toString());
      
      // Alternativa 3: Sin parámetros de procesamiento
      const cleanUrl = new URL(originalUrl);
      cleanUrl.searchParams.delete('auto');
      cleanUrl.searchParams.delete('fit');
      cleanUrl.searchParams.delete('w');
      cleanUrl.searchParams.delete('q');
      alternatives.push(cleanUrl.toString());
      
      // Alternativa 4: URL con parámetros mínimos
      const minUrl = new URL(originalUrl);
      minUrl.searchParams.set('w', '1200');
      minUrl.searchParams.set('q', '90');
      alternatives.push(minUrl.toString());
      
      // Alternativa 5: URL con parámetros de formato específico
      const formatUrl = new URL(originalUrl);
      formatUrl.searchParams.set('auto', 'format');
      formatUrl.searchParams.set('fit', 'max');
      formatUrl.searchParams.set('w', '1000');
      formatUrl.searchParams.set('q', '85');
      alternatives.push(formatUrl.toString());
      
    } catch (error) {
      console.error('Error generating alternative URLs:', error);
    }
  } else if (originalUrl.includes('images.unsplash.com')) {
    // Para URLs directas de Unsplash
    try {
      const url = new URL(originalUrl);
      
      // Intentar con diferentes tamaños
      const sizes = [800, 1000, 1200, 600];
      const qualities = [80, 85, 90, 70];
      
      sizes.forEach(size => {
        qualities.forEach(quality => {
          const altUrl = new URL(originalUrl);
          altUrl.searchParams.set('w', size.toString());
          altUrl.searchParams.set('q', quality.toString());
          alternatives.push(altUrl.toString());
        });
      });
      
    } catch (error) {
      console.error('Error generating Unsplash alternative URLs:', error);
    }
  }
  
  return alternatives;
};
