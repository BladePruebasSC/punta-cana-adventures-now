// Sistema de precarga de imágenes ultra-simplificado para velocidad máxima

class ImagePreloader {
  private preloadedImages = new Set<string>();

  // Precargar una imagen
  preloadImage(src: string): void {
    if (this.preloadedImages.has(src)) {
      return;
    }

    const img = new Image();
    img.onload = () => {
      this.preloadedImages.add(src);
    };
    img.onerror = () => {
      // Silenciar errores para no ralentizar
    };
    img.src = src;
  }

  // Precargar múltiples imágenes
  preloadImages(urls: string[]): void {
    urls
      .filter(url => !this.preloadedImages.has(url))
      .forEach(url => this.preloadImage(url));
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

// Función ultra-simplificada para precargar imágenes
export const preloadTourImages = (tours: any[]) => {
  // Solo precargar las primeras 3 imágenes principales
  const imageUrls = tours
    .slice(0, 3)
    .map(tour => tour.image_url)
    .filter(Boolean);
  
  // Precarga inmediata sin esperar
  imagePreloader.preloadImages(imageUrls);
};
