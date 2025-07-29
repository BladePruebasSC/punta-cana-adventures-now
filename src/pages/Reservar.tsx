
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Clock, Star, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
}

const Reservar = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tour, setTour] = useState<Tour | null>(null);
  const [tourImages, setTourImages] = useState<TourImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    guests: '2',
    special_requests: ''
  });

  useEffect(() => {
    if (tourId) {
      fetchTourData();
    }
  }, [tourId]);

  const fetchTourData = async () => {
    try {
      // Fetch tour info
      const { data: tourData, error: tourError } = await supabase
        .from('posts')
        .select('*')
        .eq('id', tourId)
        .single();

      if (tourError) throw tourError;
      setTour(tourData);

      // Fetch tour images
      const { data: imagesData, error: imagesError } = await supabase
        .from('tour_images')
        .select('*')
        .eq('tour_id', tourId)
        .order('order_index', { ascending: true });

      if (imagesError) throw imagesError;
      setTourImages(imagesData || []);

    } catch (error) {
      console.error('Error fetching tour data:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la información del tour",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('reservations')
        .insert([
          {
            tour_id: tourId,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            date: formData.date,
            guests: parseInt(formData.guests),
            special_requests: formData.special_requests || null,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      toast({
        title: "¡Reserva exitosa!",
        description: "Tu reserva ha sido enviada. Te contactaremos pronto para confirmar los detalles.",
      });

      // Crear mensaje para WhatsApp con todos los datos
      const whatsappMessage = `🌴 *NUEVA RESERVA - Jon Tours and Adventure* 🌴

📋 *Detalles de la Reserva:*
• Tour: ${tour?.title}
• Nombre: ${formData.name}
• Email: ${formData.email}
• Teléfono: ${formData.phone}
• Fecha: ${formData.date}
• Huéspedes: ${formData.guests}
• Precio total: $${tour ? (tour.price * parseInt(formData.guests)).toFixed(2) : '0.00'}

${formData.special_requests ? `📝 *Solicitudes especiales:*\n${formData.special_requests}\n\n` : ''}¡Esperamos confirmar esta reserva pronto! 🎉`;

      const phoneNumber = '18098408257';
      const encodedMessage = encodeURIComponent(whatsappMessage);
      
      // iOS-friendly WhatsApp redirect
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      
      setTimeout(() => {
        if (isIOS) {
          // For iOS, use whatsapp:// protocol first
          window.location.href = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;
          
          // Fallback to web version after a short delay if the app doesn't open
          setTimeout(() => {
            const fallbackUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
            window.open(fallbackUrl, '_blank');
          }, 1500);
        } else {
          window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
        }
        
        // Navigate back after WhatsApp redirect
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }, 1000);

    } catch (error) {
      console.error('Error creating reservation:', error);
      toast({
        title: "Error",
        description: "No se pudo procesar tu reserva. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información del tour...</p>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-emerald-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Tour no encontrado</CardTitle>
            <CardDescription>El tour que buscas no existe o ha sido eliminado.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              Volver al Inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-emerald-50">
      <header className="bg-white/95 backdrop-blur-sm shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Jon Tours and Adventure
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <div className="relative">
                {tourImages.length > 0 ? (
                  <Carousel className="w-full">
                    <CarouselContent>
                      {tourImages.map((image, index) => (
                        <CarouselItem key={image.id}>
                          <img 
                            src={image.image_url} 
                            alt={image.alt_text || tour.title}
                            className="w-full h-64 object-cover rounded-t-lg"
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {tourImages.length > 1 && (
                      <>
                        <CarouselPrevious className="left-2" />
                        <CarouselNext className="right-2" />
                      </>
                    )}
                  </Carousel>
                ) : (
                  <img 
                    src={tour.image_url} 
                    alt={tour.title}
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                )}
                
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white text-lg px-3 py-1">
                    ${tour.price}
                  </Badge>
                </div>
                <div className="absolute top-4 left-4">
                  <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{tour.rating}</span>
                  </div>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-2xl">{tour.title}</CardTitle>
                <CardDescription className="text-base">{tour.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-5 h-5" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-5 h-5" />
                    <span>{tour.group_size}</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Lo que incluye:</h4>
                  <div className="flex flex-wrap gap-2">
                    {tour.highlights.map((highlight, index) => (
                      <Badge key={index} variant="secondary">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>

                {tourImages.length > 1 && (
                  <div className="text-sm text-gray-600 text-center">
                    📸 {tourImages.length} fotos disponibles - Usa las flechas para ver más
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Reservar este Tour
                </CardTitle>
                <CardDescription>
                  Completa el formulario para reservar tu aventura
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre Completo *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Tu nombre completo"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="+1 (809) 840-8257"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="guests">Número de Huéspedes *</Label>
                      <Input
                        id="guests"
                        name="guests"
                        type="number"
                        min="1"
                        max="20"
                        value={formData.guests}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date">Fecha Preferida *</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="special_requests">Solicitudes Especiales</Label>
                    <Textarea
                      id="special_requests"
                      name="special_requests"
                      value={formData.special_requests}
                      onChange={handleInputChange}
                      placeholder="Alguna solicitud especial, restricciones alimentarias, etc."
                      rows={3}
                    />
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Resumen de la Reserva</h4>
                    <div className="space-y-1 text-sm text-blue-800">
                      <div className="flex justify-between">
                        <span>Tour:</span>
                        <span>{tour.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Precio por persona:</span>
                        <span>${tour.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Huéspedes:</span>
                        <span>{formData.guests}</span>
                      </div>
                      <div className="flex justify-between font-semibold border-t border-blue-200 pt-2">
                        <span>Total estimado:</span>
                        <span>${(tour.price * parseInt(formData.guests || '1')).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
                    disabled={submitting}
                  >
                    {submitting ? 'Procesando...' : 'Confirmar Reserva'}
                  </Button>
                  
                  <p className="text-sm text-gray-600 text-center">
                    * Esta es una pre-reserva. Te contactaremos para confirmar disponibilidad y procesar el pago.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservar;
