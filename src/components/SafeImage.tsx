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

  useEffect(() => {
    // Solo validar que la URL sea válida, sin hacer fetch previo para evitar problemas de CORS
    if (!isValidImageUrl(src)) {
      console.error('Invalid image URL:', src);
      setImgSrc(fallbackSrc);
      setHasError(true);
      onError?.(src);
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
    
    if (!hasError) {
      // Intentar con una URL alternativa antes de usar el fallback
      const alternativeUrl = getAlternativeImageUrl(imgSrc);
      if (alternativeUrl !== imgSrc && alternativeUrl !== fallbackSrc) {
        setImgSrc(alternativeUrl);
        return;
      }
      
      setHasError(true);
      setImgSrc(fallbackSrc);
      onError?.(imgSrc);
    }
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
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
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
