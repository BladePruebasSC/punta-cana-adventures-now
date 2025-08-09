import React, { useState, useEffect } from 'react';
import { isValidImageUrl, testImageUrl, getImageFallback, logImageLoadStatus, checkUnsplashUrl, getAlternativeImageUrl } from '@/lib/imageUtils';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onError?: (error: string) => void;
}

const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc = '/placeholder.svg',
  onError
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Reset states when src changes
    setHasError(false);
    setIsLoading(true);
    setRetryCount(0);
    
    if (!isValidImageUrl(src)) {
      console.error('Invalid image URL:', src);
      setImgSrc(fallbackSrc);
      setHasError(true);
      onError?.(src);
      setIsLoading(false);
    } else {
      // Procesar URL de Unsplash para evitar problemas de CORS
      const processedUrl = checkUnsplashUrl(src);
      setImgSrc(processedUrl);
      setHasError(false);
    }
  }, [src, fallbackSrc, onError]);

  const handleError = () => {
    console.error('Error loading image:', imgSrc);
    logImageLoadStatus(imgSrc, false);
    
    if (retryCount < 3) {
      // Intentar diferentes estrategias de fallback
      setRetryCount(prev => prev + 1);
      
      if (retryCount === 0) {
        // Primera alternativa: URL con parámetros diferentes
        const alternativeUrl = getAlternativeImageUrl(imgSrc);
        if (alternativeUrl !== imgSrc && alternativeUrl !== fallbackSrc) {
          setImgSrc(alternativeUrl);
          return;
        }
      } else if (retryCount === 1) {
        // Segunda alternativa: URL original sin procesar
        if (imgSrc !== src) {
          setImgSrc(src);
          return;
        }
      } else if (retryCount === 2) {
        // Tercera alternativa: URL de Unsplash con parámetros básicos
        if (imgSrc.includes('unsplash.com')) {
          try {
            const url = new URL(imgSrc);
            url.searchParams.set('w', '800');
            url.searchParams.set('q', '80');
            const basicUrl = url.toString();
            if (basicUrl !== imgSrc) {
              setImgSrc(basicUrl);
              return;
            }
          } catch (error) {
            console.error('Error processing Unsplash URL:', error);
          }
        }
      }
    }
    
    // Si todas las alternativas fallan, usar el fallback
    setHasError(true);
    setImgSrc(fallbackSrc);
    onError?.(imgSrc);
    setIsLoading(false);
  };

  const handleLoad = () => {
    console.log('Image loaded successfully:', imgSrc);
    logImageLoadStatus(imgSrc, true);
    setIsLoading(false);
  };

  return (
    <div className="relative">
      <img
        src={imgSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'image-loading' : ''}`}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
        crossOrigin="anonymous"
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-gray-500 text-sm">Cargando imagen...</div>
        </div>
      )}
      {hasError && (
        <div className="absolute inset-0 image-error">
          <div className="text-center">
            <div className="text-gray-400 mb-2">📷</div>
            <div className="text-sm">Imagen no disponible</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SafeImage;
