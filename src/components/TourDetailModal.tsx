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
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
       {/* Backdrop */}
       <div 
         className="absolute inset-0 bg-black/70 backdrop-blur-sm"
         onClick={onClose}
       />
      
             {/* Modal */}
       <div className="relative bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <span className="font-semibold text-gray-900">{tour.rating}</span>
            </div>
            <Badge variant="outline" className="capitalize">
              {tour.category}
            </Badge>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="rounded-full p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Image Carousel */}
          <div className="relative">
            {tourImages.length > 0 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {tourImages.map((image) => (
                    <CarouselItem key={image.id}>
                      <div className="relative h-64 md:h-80">
                        <img 
                          src={image.image_url} 
                          alt={image.alt_text}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1">
                          <Camera className="w-4 h-4" />
                          {tourImages.length}
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {tourImages.length > 1 && (
                  <>
                    <CarouselPrevious className="left-3" />
                    <CarouselNext className="right-3" />
                  </>
                )}
              </Carousel>
            ) : (
              <div className="relative h-64 md:h-80">
                <img 
                  src={tour.image_url} 
                  alt={tour.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          
          {/* Tour Info */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-3xl font-bold text-gray-900">{tour.title}</h2>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">${tour.price}</div>
                <div className="text-sm text-gray-500">por persona</div>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{tour.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{tour.group_size}</span>
              </div>
            </div>
            
            <div className="prose max-w-none mb-6">
              <p className="text-gray-700 leading-relaxed text-lg">
                {tour.description}
              </p>
            </div>
            
            {/* Highlights */}
            {tour.highlights && tour.highlights.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Puntos Destacados
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tour.highlights.map((highlight, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg"
                    >
                      <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-gray-800">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 sm:p-6 border-t bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Cerrar
            </Button>
            <Button 
              onClick={() => onReserve(tour.id)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
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
              className="flex-1 bg-green-50 border-green-200 hover:bg-green-100 text-green-600 hover:text-green-700"
            >
              <WhatsAppIcon className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetailModal;