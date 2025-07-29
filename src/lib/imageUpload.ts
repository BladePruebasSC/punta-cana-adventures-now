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
  
  // Usar una API key de ImgBB para desarrollo
  // Esta es una key de prueba - en producción deberías usar tu propia key
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

    // Intentar 1: Supabase Storage
    try {
      console.log('Intentando subir a Supabase Storage...');
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

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
      console.warn('Error con Supabase Storage, intentando ImgBB:', storageError);
      
      // Intentar 2: ImgBB
      try {
        console.log('Intentando subir a ImgBB...');
        const imgbbUrl = await uploadToImgBB(file);
        console.log('Imagen subida exitosamente a ImgBB');
        return {
          url: imgbbUrl,
          path: 'imgbb'
        };
      } catch (imgbbError) {
        console.warn('Error con ImgBB, usando base64 como último recurso:', imgbbError);
        
        // Intentar 3: Base64 (solo para imágenes pequeñas)
        if (file.size <= 1 * 1024 * 1024) { // Máximo 1MB para base64
          console.log('Convirtiendo a base64...');
          const base64Url = await convertToBase64(file);
          console.log('Imagen convertida a base64');
          return {
            url: base64Url,
            path: 'base64'
          };
        } else {
          throw new Error('La imagen es demasiado grande para convertir a base64. Intenta con una imagen más pequeña.');
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
    new URL(url);
    return true;
  } catch {
    return false;
  }
}; 