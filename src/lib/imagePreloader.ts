// Sistema de precarga de imágenes para mejorar el rendimiento

class ImagePreloader {
  private preloadedImages = new Set<string>();
  private preloadQueue: string[] = [];
  private isProcessing = false;

  // Precargar una imagen
  preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.preloadedImages.has(src)) {
        resolve();
        return;
      }

      const img = new Image();
      
      img.onload = () => {
        this.preloadedImages.add(src);
        resolve();
      };
      
      img.onerror = () => {
        reject(new Error(`Failed to preload image: ${src}`));
      };
      
      img.src = src;
    });
  }

  // Precargar múltiples imágenes en paralelo
  async preloadImages(urls: string[]): Promise<void> {
    const promises = urls
      .filter(url => !this.preloadedImages.has(url))
      .map(url => this.preloadImage(url));
    
    await Promise.allSettled(promises);
  }

  // Verificar si una imagen ya está precargada
  isPreloaded(src: string): boolean {
    return this.preloadedImages.has(src);
  }

  // Limpiar caché de imágenes precargadas
  clear(): void {
    this.preloadedImages.clear();
  }

  // Obtener estadísticas de precarga
  getStats() {
    return {
      preloadedCount: this.preloadedImages.size,
      preloadedUrls: Array.from(this.preloadedImages)
    };
  }
}

export const imagePreloader = new ImagePreloader();

// Función para precargar imágenes de tours
export const preloadTourImages = async (tours: any[], tourImages: Record<string, any[]>) => {
  const imageUrls: string[] = [];
  
  // Agregar imágenes principales de tours
  tours.forEach(tour => {
    if (tour.image_url) {
      imageUrls.push(tour.image_url);
    }
  });
  
  // Agregar imágenes adicionales de tours
  Object.values(tourImages).forEach(images => {
    images.forEach(image => {
      if (image.image_url) {
        imageUrls.push(image.image_url);
      }
    });
  });
  
  // Precargar imágenes en segundo plano
  imagePreloader.preloadImages(imageUrls).catch(error => {
    console.warn('Some images failed to preload:', error);
  });
};
