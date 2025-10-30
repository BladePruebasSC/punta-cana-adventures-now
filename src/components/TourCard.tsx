import React, { memo } from 'react';
import { Clock, Users, Star, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

interface TourCardProps {
  tour: Tour;
  onTourClick: (tourId: string) => void;
  onReserveClick: (tourId: string, e?: React.MouseEvent) => void;
  reserveText: string;
}

const TourCard: React.FC<TourCardProps> = memo(({ 
  tour, 
  onTourClick, 
  onReserveClick, 
  reserveText 
}) => {
  // Truncate description to about 80 characters
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength).split(' ').slice(0, -1).join(' ') + '...';
  };

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl bg-white overflow-hidden border-0 shadow-lg rounded-xl"
      onClick={() => onTourClick(tour.id)}
    >
      <div className="relative overflow-hidden">
        <img 
          src={tour.image_url} 
          alt={tour.title}
          className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
        <div className="absolute top-2 left-2 flex flex-col gap-1 sm:flex-row sm:gap-1">
          <Badge variant="secondary" className="bg-white/95 text-gray-800 font-semibold text-xs sm:text-sm px-2 py-1 shadow-sm">
            ${tour.price}
          </Badge>
          <div className="flex items-center gap-1 bg-white/95 rounded-full px-2 py-1 shadow-sm">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
            <span className="text-xs sm:text-sm font-semibold text-gray-800">{tour.rating}</span>
          </div>
        </div>
        <div className="absolute top-2 right-2">
          <Badge 
            variant="outline" 
            className="bg-white/95 text-gray-800 border-white/30 font-medium capitalize text-xs sm:text-sm px-2 py-1 shadow-sm"
          >
            {tour.category}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4 sm:p-5">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">
          {tour.title}
        </h3>
        
        <p className="text-gray-600 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base line-clamp-2">
          {truncateText(tour.description, 80)}
        </p>
        
        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">{tour.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">{tour.group_size}</span>
          </div>
        </div>
        
        {/* Show only first 2 highlights - Mejorado para móviles */}
        {tour.highlights && tour.highlights.length > 0 && (
          <div className="mb-4 sm:mb-5">
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {tour.highlights.slice(0, 2).map((highlight, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center gap-1 text-xs sm:text-sm bg-blue-50 text-blue-700 px-2 py-1.5 rounded-full font-medium"
                >
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate max-w-[120px] sm:max-w-none">{highlight}</span>
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex gap-2 sm:gap-3">
          <Button 
            onClick={(e) => onReserveClick(tour.id, e)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-colors text-sm sm:text-base"
          >
            {reserveText}
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              sendWhatsAppMessage({
                title: tour.title,
                price: tour.price,
                duration: tour.duration,
                description: tour.description,
                highlights: tour.highlights
              });
            }}
            variant="outline"
            size="icon"
            className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-gray-300 hover:border-green-500 hover:bg-green-50"
            aria-label="Contactar por WhatsApp"
          >
            <WhatsAppIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

TourCard.displayName = 'TourCard';

export default TourCard;