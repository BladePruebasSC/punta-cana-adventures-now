import React from 'react';
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

const TourCard: React.FC<TourCardProps> = ({ 
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
      className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white overflow-hidden border-0 shadow-lg"
      onClick={() => onTourClick(tour.id)}
    >
      <div className="relative overflow-hidden">
        <img 
          src={tour.image_url} 
          alt={tour.title}
          className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="secondary" className="bg-white/90 text-gray-800 font-medium">
            ${tour.price}
          </Badge>
          <div className="flex items-center gap-1 bg-white/90 rounded-full px-2 py-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium text-gray-800">{tour.rating}</span>
          </div>
        </div>
        <div className="absolute top-3 right-3">
          <Badge 
            variant="outline" 
            className="bg-white/90 text-gray-800 border-white/20 font-medium capitalize"
          >
            {tour.category}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {tour.title}
        </h3>
        
        <p className="text-gray-600 mb-4 leading-relaxed">
          {truncateText(tour.description, 80)}
        </p>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{tour.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{tour.group_size}</span>
          </div>
        </div>
        
        {/* Show only first 2 highlights */}
        {tour.highlights && tour.highlights.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {tour.highlights.slice(0, 2).map((highlight, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full"
                >
                  <MapPin className="w-3 h-3" />
                  {highlight}
                </span>
              ))}
              {tour.highlights.length > 2 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{tour.highlights.length - 2} más
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button 
            onClick={(e) => onReserveClick(tour.id, e)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-medium"
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
            className="bg-green-50 border-green-200 hover:bg-green-100 text-green-600 hover:text-green-700"
            title="Contáctame por WhatsApp"
          >
            <WhatsAppIcon className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TourCard;