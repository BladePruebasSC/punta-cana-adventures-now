import React, { useState, useEffect, memo } from 'react';

interface RobustImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onError?: (error: string) => void;
}

const RobustImage: React.FC<RobustImageProps> = memo(({
  src,
  alt,
  className = '',
  fallbackSrc = '/placeholder.svg',
  onError
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reset states when src changes
    setHasError(false);
    setIsLoading(true);
    setCurrentSrc(src);
  }, [src]);

  const handleError = () => {
    console.error('Error loading image:', currentSrc);
    
    if (!hasError) {
      // Intentar con el fallback
      setHasError(true);
      setCurrentSrc(fallbackSrc);
      onError?.(src);
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    console.log('Image loaded successfully:', currentSrc);
    setIsLoading(false);
    setHasError(false);
  };

  return (
    <div className="relative">
      <img
        src={currentSrc}
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
});

export default RobustImage;
