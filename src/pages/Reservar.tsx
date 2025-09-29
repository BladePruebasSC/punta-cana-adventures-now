
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Clock, Star, ArrowLeft, Menu, X, MessageCircle, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { supabase } from '@/integrations/supabase/client';
import { toursCache, tourImagesCache, CACHE_KEYS } from '@/lib/cache';
import { useToast } from '@/hooks/use-toast';
import { sendWhatsAppMessage } from '@/lib/utils';
import WhatsAppIcon from '@/components/ui/whatsapp-icon';
import RobustImage from '@/components/RobustImage';
import PaymentMethodSelector from '@/components/PaymentMethodSelector';
import PayPalPayment from '@/components/PayPalPayment';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPaymentMethodSelector, setShowPaymentMethodSelector] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'paypal' | 'whatsapp' | null>(null);
  const [showPayPalForm, setShowPayPalForm] = useState(false);

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
      // Check cache first
      const cachedTour = toursCache.get<Tour>(CACHE_KEYS.TOUR_DETAIL(tourId));
      const cachedImages = tourImagesCache.get<TourImage[]>(CACHE_KEYS.TOUR_IMAGES_DETAIL(tourId));
      
      if (cachedTour && cachedImages) {
        console.log('Using cached tour data');
        setTour(cachedTour);
        setTourImages(cachedImages);
        setLoading(false);
        return;
      }

      // Fetch tour info and images in parallel for better performance
      const [tourResponse, imagesResponse] = await Promise.all([
        supabase
          .from('posts')
          .select('*')
          .eq('id', tourId)
          .single(),
        supabase
          .from('tour_images')
          .select('*')
          .eq('tour_id', tourId)
          .order('order_index', { ascending: true })
      ]);

      const { data: tourData, error: tourError } = tourResponse;
      const { data: imagesData, error: imagesError } = imagesResponse;

      if (tourError) throw tourError;
      if (imagesError) throw imagesError;

      // Cache the data
      toursCache.set(CACHE_KEYS.TOUR_DETAIL(tourId), tourData, 10 * 60 * 1000); // 10 minutes
      tourImagesCache.set(CACHE_KEYS.TOUR_IMAGES_DETAIL(tourId), imagesData || [], 10 * 60 * 1000);

      console.log('Tour data loaded:', tourData);
      setTour(tourData);
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
    
    // Validar campos requeridos
    if (!formData.name || !formData.email || !formData.phone || !formData.date) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    // Mostrar selector de método de pago
    setShowPaymentMethodSelector(true);
  };

  const handlePaymentMethodSelect = (method: 'paypal' | 'whatsapp') => {
    setSelectedPaymentMethod(method);
    setShowPaymentMethodSelector(false);
    
    if (method === 'paypal') {
      setShowPayPalForm(true);
    } else {
      // Proceder con WhatsApp
      handleWhatsAppReservation();
    }
  };

  const handleWhatsAppReservation = async () => {
    setSubmitting(true);

    try {
      const totalAmount = tour ? tour.price * parseInt(formData.guests) : 0;
      
      console.log('Creating WhatsApp reservation with data:', {
        tour_id: tourId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        date: formData.date,
        guests: parseInt(formData.guests),
        totalAmount
      });
      
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
            status: 'pending',
            payment_method: 'whatsapp',
            payment_status: 'pending',
            total_amount: totalAmount
          }
        ]);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // Crear mensaje para WhatsApp con todos los datos
      const whatsappMessage = `🌴 *NUEVA RESERVA - Jon Tour Punta Cana* 🌴

📋 *Detalles de la Reserva:*
• Tour: ${tour?.title}
• Nombre: ${formData.name}
• Email: ${formData.email}
• Teléfono: ${formData.phone}
• Fecha: ${formData.date}
• Huéspedes: ${formData.guests}
• Precio total: $${totalAmount.toFixed(2)}

${formData.special_requests ? `📝 *Solicitudes especiales:*\n${formData.special_requests}\n\n` : ''}¡Esperamos confirmar esta reserva pronto! 🎉`;

      const phoneNumber = '18098408257';
      const encodedMessage = encodeURIComponent(whatsappMessage);
      
      // Mostrar mensaje de éxito
      toast({
        title: "¡Reserva enviada!",
        description: "Redirigiendo a WhatsApp para confirmar tu reserva...",
      });
      
      // Redirigir a WhatsApp después de un breve delay
      setTimeout(() => {
        // Detectar si es iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        
        if (isIOS) {
          // Para iOS, usar el protocolo whatsapp:// primero
          window.location.href = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;
          
          // Fallback a la versión web si la app no se abre
          setTimeout(() => {
            const fallbackUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
            window.open(fallbackUrl, '_blank');
          }, 2000);
        } else {
          // Para Android y otros dispositivos
          window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
        }
        
        // Navegar de vuelta después de la redirección a WhatsApp
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }, 1500);

    } catch (error) {
      console.error('Error creating WhatsApp reservation:', error);
      toast({
        title: "Error",
        description: `No se pudo procesar tu reserva. Error: ${error.message || 'Error desconocido'}`,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };


  const handlePayPalSuccess = async (paymentData: any) => {
    setSubmitting(true);

    try {
      const totalAmount = tour ? tour.price * parseInt(formData.guests) : 0;
      
      // Crear reserva con pago exitoso
      const { data: reservation, error: reservationError } = await supabase
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
            status: 'confirmed',
            payment_method: 'paypal',
            payment_status: 'paid',
            total_amount: totalAmount
          }
        ])
        .select()
        .single();

      if (reservationError) throw reservationError;

      // Crear registro de pago
      const { error: paymentError } = await supabase
        .from('payments')
        .insert([
          {
            reservation_id: reservation.id,
            payment_intent_id: paymentData.id,
            amount: totalAmount,
            currency: 'USD',
            status: 'succeeded',
            payment_method: 'paypal',
            payment_type: 'full',
            metadata: {
              tour_title: tour?.title,
              guest_name: formData.name,
              guest_email: formData.email,
              guest_phone: formData.phone,
              tour_date: formData.date,
              guest_count: formData.guests,
              paypal_order_id: paymentData.id,
              paypal_status: paymentData.status
            }
          }
        ]);

      if (paymentError) throw paymentError;

      toast({
        title: "¡Reserva confirmada!",
        description: "Tu reserva ha sido pagada y confirmada exitosamente con PayPal.",
      });

      // Redirigir a página de confirmación
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error('Error processing PayPal success:', error);
      toast({
        title: "Error",
        description: "Hubo un problema confirmando tu reserva. Contacta soporte.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayPalError = (error: any) => {
    console.error('PayPal error:', error);
    toast({
      title: "Error en el pago",
      description: error.message || "Hubo un problema procesando tu pago con PayPal",
      variant: "destructive",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-emerald-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Cargando información del tour...</p>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-emerald-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-lg sm:text-xl">Tour no encontrado</CardTitle>
            <CardDescription className="text-sm sm:text-base">El tour que buscas no existe o ha sido eliminado.</CardDescription>
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-emerald-50 reservar-page">
      {/* Header Móvil Optimizado */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="p-2 sm:p-2"
                size="sm"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline ml-2">Volver</span>
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center">
                  <MapPin className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                </div>
                <h1 className="text-sm sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  Jon Tour Punta Cana
                </h1>
              </div>
            </div>
            
            {/* Menú móvil */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
          
          {/* Menú desplegable móvil */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-3 space-y-2">
              <Button
                variant="ghost"
                onClick={() => {
                  navigate('/');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full justify-start"
              >
                Inicio
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  navigate('/nosotros');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full justify-start"
              >
                Nosotros
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  navigate('/contacto');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full justify-start"
              >
                Contacto
              </Button>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Información del Tour - Optimizado para móvil */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <Card className="overflow-hidden">
              <div className="relative">
                {tourImages.length > 0 ? (
                  <Carousel className="w-full">
                    <CarouselContent>
                      {tourImages.map((image, index) => (
                        <CarouselItem key={image.id}>
                          <div className="carousel-image">
                            <RobustImage 
                              src={image.image_url} 
                              alt={image.alt_text || tour.title}
                              className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover bg-gray-100"
                              onError={(errorUrl) => {
                                console.error('Error loading tour image:', errorUrl);
                              }}
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {tourImages.length > 1 && (
                      <>
                        <CarouselPrevious className="left-2 h-8 w-8 sm:h-10 sm:w-10" />
                        <CarouselNext className="right-2 h-8 w-8 sm:h-10 sm:w-10" />
                      </>
                    )}
                  </Carousel>
                ) : (
                  <div className="carousel-image">
                    <RobustImage 
                      src={tour.image_url} 
                      alt={tour.title}
                      className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover bg-gray-100"
                      onError={(errorUrl) => {
                        console.error('Error loading tour image:', errorUrl);
                      }}
                    />
                  </div>
                )}
                
                {/* Badges optimizados para móvil */}
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                  <Badge className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white text-sm sm:text-lg px-2 sm:px-3 py-1">
                    ${tour.price}
                  </Badge>
                </div>
                <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                  <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
                    <span className="font-medium text-sm sm:text-base">{tour.rating}</span>
                  </div>
                </div>
              </div>
              
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl lg:text-2xl leading-tight">{tour.title}</CardTitle>
                <CardDescription className="text-sm sm:text-base text-black font-medium leading-relaxed mt-2">
                  {tour.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-4 sm:p-6 space-y-4">
                {/* Información del tour optimizada */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 text-black font-medium text-sm sm:text-base">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-black font-medium text-sm sm:text-base">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span>{tour.group_size}</span>
                  </div>
                </div>
                
                {/* Highlights optimizados */}
                <div>
                  <h4 className="font-semibold mb-2 text-black text-sm sm:text-base">Lo que incluye:</h4>
                  <div className="flex flex-wrap gap-2">
                    {tour.highlights.map((highlight, index) => (
                      <Badge key={index} variant="secondary" className="text-xs sm:text-sm">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Botón WhatsApp optimizado */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={() => sendWhatsAppMessage({
                      title: tour.title,
                      price: tour.price,
                      duration: tour.duration,
                      description: tour.description,
                      highlights: tour.highlights
                    })}
                    variant="outline"
                    className="bg-green-50 border-green-200 hover:bg-green-100 text-green-600 hover:text-green-700 text-sm sm:text-base flex-1 sm:flex-none"
                  >
                    <WhatsAppIcon className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Contáctame por WhatsApp</span>
                    <span className="sm:hidden">WhatsApp</span>
                  </Button>
                </div>

                {tourImages.length > 1 && (
                  <div className="text-xs sm:text-sm text-black text-center font-medium">
                    📸 {tourImages.length} fotos disponibles - Usa las flechas para ver más
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Formulario de Reserva - Optimizado para móvil */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20 lg:top-24">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-black text-lg sm:text-xl">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                  Reservar este Tour
                </CardTitle>
                <CardDescription className="text-black font-medium text-sm sm:text-base">
                  Completa el formulario para reservar tu aventura
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Campos del formulario optimizados */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-black font-semibold text-sm sm:text-base">Nombre Completo *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Tu nombre completo"
                        className="text-sm sm:text-base"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-black font-semibold text-sm sm:text-base">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="tu@email.com"
                        className="text-sm sm:text-base"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-black font-semibold text-sm sm:text-base">Teléfono *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="+1 (809) 840-8257"
                        className="text-sm sm:text-base"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="guests" className="text-black font-semibold text-sm sm:text-base">Huéspedes *</Label>
                      <Input
                        id="guests"
                        name="guests"
                        type="number"
                        min="1"
                        max="20"
                        value={formData.guests}
                        onChange={handleInputChange}
                        required
                        className="text-sm sm:text-base"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-black font-semibold text-sm sm:text-base">Fecha Preferida *</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="text-sm sm:text-base"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="special_requests" className="text-black font-semibold text-sm sm:text-base">Solicitudes Especiales</Label>
                    <Textarea
                      id="special_requests"
                      name="special_requests"
                      value={formData.special_requests}
                      onChange={handleInputChange}
                      placeholder="Alguna solicitud especial, restricciones alimentarias, etc."
                      rows={3}
                      className="text-sm sm:text-base"
                    />
                  </div>
                  
                  {/* Resumen optimizado */}
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">Resumen de la Reserva</h4>
                    <div className="space-y-1 text-xs sm:text-sm text-blue-800">
                      <div className="flex justify-between">
                        <span>Tour:</span>
                        <span className="text-right max-w-[60%]">{tour.title}</span>
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
                    className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-sm sm:text-base py-3"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Continuar con el Pago
                      </>
                    )}
                  </Button>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                    <div className="flex items-start space-x-2">
                      <CreditCard className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-xs sm:text-sm text-blue-800">
                        <p className="font-medium mb-1">Opciones de pago disponibles:</p>
                        <p>• Pago con PayPal (sin cuenta necesaria)</p>
                        <p>• Coordinación por WhatsApp (método tradicional)</p>
                        <p>• Confirmación inmediata con pago en línea</p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs sm:text-sm text-black text-center font-medium mt-3">
                    * Puedes elegir entre pago en línea (PayPal) o coordinar por WhatsApp
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal para selector de método de pago */}
      {showPaymentMethodSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <PaymentMethodSelector
                totalAmount={tour ? tour.price * parseInt(formData.guests) : 0}
                onSelectMethod={handlePaymentMethodSelect}
                tourTitle={tour?.title || ''}
                guestCount={parseInt(formData.guests)}
              />
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={() => setShowPaymentMethodSelector(false)}
                  className="mr-2"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para formulario de PayPal */}
      {showPayPalForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Pago con PayPal
                </h2>
                <p className="text-gray-600">
                  Completa tu pago de forma segura con PayPal
                </p>
              </div>
              
              <PayPalPayment
                amount={tour ? tour.price * parseInt(formData.guests) : 0}
                currency="USD"
                onPaymentSuccess={handlePayPalSuccess}
                onPaymentError={handlePayPalError}
                tourTitle={tour?.title || ''}
                guestName={formData.name}
                guestEmail={formData.email}
              />
              
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPayPalForm(false);
                    setShowPaymentMethodSelector(true);
                  }}
                >
                  Volver a opciones de pago
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservar;
