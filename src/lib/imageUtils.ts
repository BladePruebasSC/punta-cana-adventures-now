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
    // Intentar con diferentes parámetros
    const url = new URL(originalUrl);
    url.searchParams.set('auto', 'format');
    url.searchParams.set('fit', 'crop');
    url.searchParams.set('w', '600');
    url.searchParams.set('q', '70');
    return url.toString();
  }
  
  // Si no es Unsplash, usar una imagen de placeholder
  return '/placeholder.svg';
};
