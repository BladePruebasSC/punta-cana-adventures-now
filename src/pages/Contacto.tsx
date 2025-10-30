
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeft, Phone, Mail, Clock, MessageCircle, Send, MapPin as Location, Users, Award, Star, Globe, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Contacto = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      console.log('Enviando mensaje:', formData);
      
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            subject: formData.subject,
            message: formData.message,
            status: 'unread'
          }
        ]);

      if (error) {
        console.error('Error al guardar mensaje:', error);
        throw error;
      }

      console.log('Mensaje guardado exitosamente:', data);

      toast({
        title: "¡Mensaje enviado!",
        description: "Gracias por contactarnos. Te responderemos pronto.",
      });
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error completo:', error);
      toast({
        title: "Error al enviar mensaje",
        description: "Hubo un problema. Por favor intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-emerald-50">
      {/* Header - Ultra optimizado para móvil */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center py-3 sm:py-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mr-3 sm:mr-4 p-2 sm:p-3"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Volver</span>
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
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
        {/* Hero Section - Ultra optimizada para móvil */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Contáctanos
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2">
            ¿Tienes preguntas sobre nuestros tours? ¿Necesitas información personalizada? 
            Estamos aquí para ayudarte a planificar tu próxima aventura.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Contact Information - Ultra optimizada para móvil */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <Card className="rounded-xl shadow-lg">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base font-bold">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  Información de Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1 text-sm sm:text-base">Teléfono</h4>
                    <p className="text-gray-600 text-sm sm:text-base">+1 (809) 840-8257</p>
                    <p className="text-xs sm:text-sm text-gray-500">WhatsApp disponible</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1 text-sm sm:text-base">Email</h4>
                    <p className="text-gray-600 text-xs sm:text-sm break-all">jontourpuntacana@gmail.com</p>
                    <p className="text-xs sm:text-sm text-gray-500">Respuesta en 24 horas</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Location className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1 text-sm sm:text-base">Ubicación</h4>
                    <p className="text-gray-600 text-sm sm:text-base">Bávaro, Punta Cana</p>
                    <p className="text-xs sm:text-sm text-gray-500">República Dominicana</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1 text-sm sm:text-base">Horarios</h4>
                    <p className="text-gray-600 text-sm sm:text-base">7:00 AM - 10:00 PM</p>
                    <p className="text-xs sm:text-sm text-gray-500">Todos los días</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-lg">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-sm sm:text-base font-bold">Formas Rápidas de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white h-11 sm:h-12 text-sm sm:text-base font-bold rounded-lg"
                  onClick={() => window.open('https://wa.me/18098408257', '_blank')}
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  WhatsApp
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full h-11 sm:h-12 text-sm sm:text-base font-bold rounded-lg"
                  onClick={() => window.location.href = 'tel:+18098408257'}
                >
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Llamar Ahora
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full h-11 sm:h-12 text-sm sm:text-base font-bold rounded-lg"
                  onClick={() => window.location.href = 'mailto:jontourpuntacana@gmail.com'}
                >
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Enviar Email
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form - Ultra optimizado para móvil */}
          <div className="lg:col-span-2">
            <Card className="rounded-xl shadow-lg">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold">Envíanos un Mensaje</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Completa el formulario y nos pondremos en contacto contigo lo antes posible
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm sm:text-base font-bold">Nombre Completo *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Tu nombre completo"
                        className="h-11 sm:h-12 text-sm sm:text-base rounded-lg"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm sm:text-base font-bold">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="tu@email.com"
                        className="h-11 sm:h-12 text-sm sm:text-base rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm sm:text-base font-bold">Teléfono</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (809) 555-0123"
                        className="h-11 sm:h-12 text-sm sm:text-base rounded-lg"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-sm sm:text-base font-bold">Asunto *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        placeholder="¿En qué podemos ayudarte?"
                        className="h-11 sm:h-12 text-sm sm:text-base rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm sm:text-base font-bold">Mensaje *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      placeholder="Cuéntanos más detalles sobre lo que necesitas..."
                      rows={5}
                      className="text-sm sm:text-base rounded-lg"
                    />
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-emerald-50 p-3 sm:p-4 rounded-xl border border-blue-200">
                    <h4 className="font-bold text-blue-900 mb-2 text-sm sm:text-base">💡 Consejos para obtener una respuesta rápida:</h4>
                    <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
                      <li>• Menciona las fechas en las que planeas viajar</li>
                      <li>• Indica el número de personas en tu grupo</li>
                      <li>• Comparte tus intereses específicos (aventura, cultura, playa, etc.)</li>
                      <li>• Si tienes restricciones especiales, háznoslo saber</li>
                    </ul>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-sm sm:text-base py-3 sm:py-4 h-12 sm:h-14 font-bold rounded-lg shadow-lg"
                    disabled={submitting}
                  >
                    {submitting ? (
                      'Enviando...'
                    ) : (
                      <>
                        <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Enviar Mensaje
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section - Ultra optimizada para móvil */}
        <Card className="mt-8 sm:mt-12 rounded-xl shadow-lg">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl text-center font-bold">Preguntas Frecuentes</CardTitle>
            <CardDescription className="text-center text-sm sm:text-base">
              Respuestas a las preguntas más comunes
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h4 className="font-bold text-base sm:text-lg mb-2">¿Cuánto tiempo antes debo reservar?</h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Recomendamos reservar al menos 48 horas antes, aunque aceptamos reservas 
                    de último minuto sujetas a disponibilidad.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-base sm:text-lg mb-2">¿Qué incluyen los tours?</h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Cada tour incluye guía especializado, transporte, y todo lo especificado 
                    en la descripción. Las comidas están incluidas donde se indica.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-base sm:text-lg mb-2">¿Hay tours privados?</h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Sí, ofrecemos tours privados para grupos. Los precios se ajustan según 
                    el tamaño del grupo y las personalizaciones solicitadas.
                  </p>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h4 className="font-bold text-base sm:text-lg mb-2">¿Qué pasa si llueve?</h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Nuestros tours continúan con lluvia ligera. En caso de mal tiempo severo, 
                    reprogramamos sin costo adicional.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-base sm:text-lg mb-2">¿Recogen en el hotel?</h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Sí, ofrecemos servicio de recogida en la mayoría de hoteles en Punta Cana 
                    y Bávaro. Confirmamos los detalles al reservar.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-base sm:text-lg mb-2">¿Aceptan grupos grandes?</h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Sí, tenemos experiencia con grupos corporativos y familiares grandes. 
                    Contáctanos para opciones especiales.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sobre Nosotros Section - Ultra optimizada para móvil */}
        <section className="mt-12 sm:mt-16">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Sobre Jon Tour Punta Cana
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              Más de 20 años creando experiencias inolvidables en Punta Cana
            </p>
          </div>

          {/* Historia y Experiencia - Ultra optimizadas para móvil */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <Card className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl shadow-lg">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base font-bold">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  Nuestra Historia
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                <p className="text-gray-700 text-sm sm:text-base">
                  <strong>Jon Tour Punta Cana</strong> nace en el 2021 como una empresa operadora 
                  especializada en ventas de productos vacacionales online y servicios terrestres.
                </p>
                <p className="text-gray-700 text-sm sm:text-base">
                  Desde el 2002 venimos trabajando para diferentes marcas y empresas dentro de la 
                  industria hotelera y turística en todo Punta Cana, adquiriendo una vasta experiencia.
                </p>
                <div className="bg-blue-100 p-3 sm:p-4 rounded-lg">
                  <h4 className="font-bold text-blue-900 mb-2 text-sm sm:text-base">Nuestra Misión</h4>
                  <p className="text-blue-800 text-xs sm:text-sm">
                    Apostamos a la buena calidad, responsabilidad y por el buen servicio que cada 
                    quien espera recibir al adquirir un paquete de servicios.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl shadow-lg">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base font-bold">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                  Lo Que Ofrecemos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    <span className="font-bold text-sm sm:text-base">Tours & Excursiones únicas</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                    <span className="font-bold text-sm sm:text-base">Transporte confiable y cómodo</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                    <span className="font-bold text-sm sm:text-base">Experiencias personalizadas</span>
                  </div>
                </div>
                <div className="bg-emerald-100 p-3 sm:p-4 rounded-lg">
                  <h4 className="font-bold text-emerald-900 mb-2 text-sm sm:text-base">Nuestro Objetivo</h4>
                  <p className="text-emerald-800 text-xs sm:text-sm">
                    Crear experiencias memorables en el corazón de cada visitante con productos 
                    de alta calidad y servicio personalizado.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gerente General - Ultra optimizado para móvil */}
          <Card className="max-w-2xl mx-auto mb-8 sm:mb-12 rounded-xl shadow-lg">
            <CardHeader className="text-center p-4 sm:p-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-r from-blue-600 to-emerald-600 flex items-center justify-center">
                <Users className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <CardTitle className="text-lg sm:text-xl font-bold">Jonathan E. Francois</CardTitle>
              <CardDescription className="text-base sm:text-lg">Gerente General</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
              <div className="flex items-center justify-center space-x-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700 break-all text-xs sm:text-sm">jontourpuntacana@gmail.com</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Phone className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700 text-xs sm:text-sm">+1-(809)-840-8357</span>
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas - Ultra optimizadas para móvil */}
          <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl p-6 sm:p-8 mb-8 sm:mb-12">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Nuestros Logros</h3>
              <p className="text-blue-100 text-sm sm:text-base">Números que reflejan nuestro compromiso con la excelencia</p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">20+</div>
                <div className="text-blue-100 text-xs sm:text-sm">Años de Experiencia</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">1000+</div>
                <div className="text-blue-100 text-xs sm:text-sm">Clientes Satisfechos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">15+</div>
                <div className="text-blue-100 text-xs sm:text-sm">Tours Únicos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">5.0</div>
                <div className="text-blue-100 text-xs sm:text-sm">Rating Promedio</div>
              </div>
            </div>
          </div>

          {/* Call to Action - Ultra optimizado para móvil */}
          <Card className="bg-gradient-to-br from-blue-50 to-emerald-50 text-center rounded-xl shadow-lg">
            <CardContent className="pt-6 sm:pt-8 p-4 sm:p-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                ¿Listo para tu Aventura en Punta Cana?
              </h3>
              <p className="text-gray-600 mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base">
                Únete a miles de viajeros que han confiado en nosotros para crear 
                experiencias inolvidables en el paraíso caribeño.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-emerald-600 h-12 sm:h-14 text-sm sm:text-base font-bold rounded-lg"
                  onClick={() => navigate('/')}
                >
                  Ver Tours Disponibles
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="h-12 sm:h-14 text-sm sm:text-base font-bold rounded-lg"
                  onClick={() => window.open('https://wa.me/18098408257', '_blank')}
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  WhatsApp Directo
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Contacto;
