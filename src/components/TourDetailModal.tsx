import React from 'react';
import { X, Clock, Users, Star, MapPin, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { sendWhatsAppMessage } from '@/lib/utils';
import WhatsAppIcon from '@/components/ui/whatsapp-icon';

interface Tour {
  id: string;
  title: string;
  description: string;
  image_url: string;
  price: number;
  duration: string;
  rating: number;
  category: string;
  group_size: string;
  highlights: string[];
}

interface TourImage {
  id: string;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  order_index: number;
  tour_id: string;
}

interface TourDetailModalProps {
  tour: Tour | null;
  tourImages: TourImage[];
  isOpen: boolean;
  onClose: () => void;
  onReserve: (tourId: string) => void;
  reserveText: string;
}

const TourDetailModal: React.FC<TourDetailModalProps> = ({
  tour,
  tourImages,
  isOpen,
  onClose,
  onReserve,
  reserveText
}) => {
  if (!isOpen || !tour) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
    
      {/* Modal - Optimizado para móviles */}
      <div className="relative bg-white rounded-xl sm:rounded-2xl max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header - Mejorado para móviles */}
        <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-current flex-shrink-0" />
              <span className="font-semibold text-gray-900 text-sm sm:text-base">{tour.rating}</span>
            </div>
            <Badge variant="outline" className="capitalize text-xs sm:text-sm">
              {tour.category}
            </Badge>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="rounded-full p-2 flex-shrink-0"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
        
        {/* Content - Optimizado para móviles */}
        <div className="overflow-y-auto max-h-[calc(95vh-140px)] sm:max-h-[calc(90vh-140px)]">
          {/* Image Carousel - Mejorado para móviles */}
          <div className="relative">
            {tourImages.length > 0 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {tourImages.map((image) => (
                    <CarouselItem key={image.id}>
                      <div className="relative h-48 sm:h-64 md:h-80">
                        <img 
                          src={image.image_url} 
                          alt={image.alt_text}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs sm:text-sm flex items-center gap-1">
                          <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                          {tourImages.length}
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {tourImages.length > 1 && (
                  <>
                    <CarouselPrevious className="left-2 sm:left-3 h-8 w-8 sm:h-10 sm:w-10" />
                    <CarouselNext className="right-2 sm:right-3 h-8 w-8 sm:h-10 sm:w-10" />
                  </>
                )}
              </Carousel>
            ) : (
              <div className="relative h-48 sm:h-64 md:h-80">
                <img 
                  src={tour.image_url} 
                  alt={tour.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          
          {/* Tour Info - Optimizado para móviles */}
          <div className="p-3 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6 gap-3">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{tour.title}</h2>
              <div className="text-left sm:text-right">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">${tour.price}</div>
                <div className="text-xs sm:text-sm text-gray-500">por persona</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-gray-600 mb-4 sm:mb-6">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-sm sm:text-base">{tour.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-sm sm:text-base">{tour.group_size}</span>
              </div>
            </div>
            
            <div className="prose max-w-none mb-4 sm:mb-6">
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg">
                {tour.description}
              </p>
            </div>
            
            {/* Highlights - Optimizado para móviles */}
            {tour.highlights && tour.highlights.length > 0 && (
              <div className="mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  Puntos Destacados
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {tour.highlights.map((highlight, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg"
                    >
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-800 text-sm sm:text-base">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer - Optimizado para móviles */}
        <div className="p-3 sm:p-4 md:p-6 border-t bg-gray-50 sticky bottom-0">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1 order-2 sm:order-1 text-sm sm:text-base"
            >
              Cerrar
            </Button>
            <Button 
              onClick={() => onReserve(tour.id)}
              className="flex-1 order-1 sm:order-2 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-sm sm:text-base font-semibold"
            >
              {reserveText}
            </Button>
            <Button 
              onClick={() => sendWhatsAppMessage({
                title: tour.title,
                price: tour.price,
                duration: tour.duration,
                description: tour.description,
                highlights: tour.highlights
              })}
              variant="outline"
              className="flex-1 order-3 bg-green-50 border-green-200 hover:bg-green-100 text-green-600 hover:text-green-700 text-sm sm:text-base"
            >
              <WhatsAppIcon className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">WhatsApp</span>
              <span className="sm:hidden">WA</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetailModal;