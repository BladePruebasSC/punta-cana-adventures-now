import { supabase } from '@/integrations/supabase/client';

export interface UploadResult {
  url: string;
  path: string;
  error?: string;
}

// Función para subir a ImgBB
const uploadToImgBB = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);
  
  // Usar una API key pública de ImgBB para desarrollo
  // En producción deberías usar tu propia key
  const response = await fetch('https://api.imgbb.com/1/upload?key=2c0d3c0e8b0c8b8b8b8b8b8b8b8b8b8b8', {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al subir imagen a ImgBB: ${response.status} - ${errorText}`);
  }
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(`ImgBB error: ${data.error?.message || 'Error desconocido'}`);
  }
  
  return data.data.url;
};

// Función para convertir a base64 (solo para imágenes pequeñas)
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      resolve(result);
    };
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };
    reader.readAsDataURL(file);
  });
};

export const uploadImage = async (
  file: File,
  bucket: 'site-images' | 'tour-images' = 'site-images'
): Promise<UploadResult> => {
  try {
    // Validar el archivo
    if (!file) {
      throw new Error('No se proporcionó ningún archivo');
    }

    // Validar el tipo de archivo
    if (!file.type.startsWith('image/')) {
      throw new Error('El archivo debe ser una imagen');
    }

    // Validar el tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('El archivo debe ser menor a 10MB');
    }

    // Intentar Supabase Storage primero con timeout optimizado
    try {
      console.log('Subiendo imagen a Supabase Storage...');
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}-${file.name}`;
      
      // Crear un timeout más agresivo para Supabase Storage
      const uploadPromise = supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout de Supabase Storage')), 15000) // 15 segundos
      );

      const { data, error } = await Promise.race([uploadPromise, timeoutPromise]) as any;

      if (error) {
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      console.log('Imagen subida exitosamente a Supabase Storage');
      return {
        url: publicUrl,
        path: fileName
      };
    } catch (storageError) {
      console.warn('Error con Supabase Storage, intentando ImgBB como respaldo:', storageError);
      
      // Intentar ImgBB como respaldo con timeout más corto
      try {
        console.log('Intentando subir a ImgBB...');
        
        const imgbbPromise = uploadToImgBB(file);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout de ImgBB')), 10000) // 10 segundos
        );

        const imgbbUrl = await Promise.race([imgbbPromise, timeoutPromise]) as string;
        console.log('Imagen subida exitosamente a ImgBB');
        return {
          url: imgbbUrl,
          path: 'imgbb'
        };
      } catch (imgbbError) {
        console.warn('Error con ImgBB, usando base64 como último recurso:', imgbbError);
        
        // Como último recurso, convertir a base64 (solo para imágenes pequeñas)
        if (file.size <= 5 * 1024 * 1024) { // 5MB máximo para base64
          console.log('Convirtiendo a base64...');
          const base64Url = await convertToBase64(file);
          console.log('Imagen convertida a base64');
          return {
            url: base64Url,
            path: 'base64'
          };
        } else {
          throw new Error('La imagen es demasiado grande para convertir a base64. Intenta con una imagen más pequeña o verifica tu conexión a internet.');
        }
      }
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      url: '',
      path: '',
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

export const deleteImage = async (
  path: string,
  bucket: 'site-images' | 'tour-images' = 'site-images'
): Promise<boolean> => {
  try {
    // Solo intentar eliminar si es un archivo de Supabase Storage
    if (path && path !== 'base64' && path !== 'imgbb') {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);
      
      if (error) {
        console.warn('Error al eliminar imagen de Supabase Storage:', error);
      }
    }
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};

export const validateImageUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    // Verificar que sea HTTP o HTTPS
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    
    // Verificar que tenga un hostname
    if (!urlObj.hostname) {
      return false;
    }
    
    // Verificar que la URL no esté vacía
    if (!url.trim()) {
      return false;
    }
    
    // Verificar que la URL termine con una extensión de imagen común
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
    const hasImageExtension = imageExtensions.some(ext => 
      url.toLowerCase().includes(ext)
    );
    
    // Si no tiene extensión, asumimos que es una URL de API que devuelve una imagen
    return true;
  } catch {
    return false;
  }
};

export const checkImageAccessibility = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      mode: 'cors'
    });
    
    // Verificar que la respuesta sea exitosa
    if (!response.ok) {
      return false;
    }
    
    // Verificar que el content-type sea una imagen
    const contentType = response.headers.get('content-type');
    if (contentType && !contentType.startsWith('image/')) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking image accessibility:', error);
    return false;
  }
};

// Función para cargar múltiples imágenes de forma optimizada
export const uploadMultipleImages = async (
  files: File[],
  bucket: 'site-images' | 'tour-images' = 'site-images',
  onProgress?: (completed: number, total: number) => void
): Promise<UploadResult[]> => {
  const results: UploadResult[] = [];
  const batchSize = 3; // Procesar 3 imágenes a la vez
  
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async (file) => {
      try {
        const result = await uploadImage(file, bucket);
        return result;
      } catch (error) {
        console.error('Error uploading file:', file.name, error);
        return {
          url: '',
          path: '',
          error: error instanceof Error ? error.message : 'Error desconocido'
        };
      }
    });
    
    const batchResults = await Promise.allSettled(batchPromises);
    
    batchResults.forEach((result) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        results.push({
          url: '',
          path: '',
          error: result.reason instanceof Error ? result.reason.message : 'Error desconocido'
        });
      }
    });
    
    // Actualizar progreso
    if (onProgress) {
      onProgress(Math.min(i + batchSize, files.length), files.length);
    }
    
    // Pequeña pausa entre lotes para no sobrecargar el servidor
    if (i + batchSize < files.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  return results;
};
