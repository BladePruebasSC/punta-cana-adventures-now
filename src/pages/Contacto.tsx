
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
      {/* Header */}
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
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Contáctanos
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ¿Tienes preguntas sobre nuestros tours? ¿Necesitas información personalizada? 
            Estamos aquí para ayudarte a planificar tu próxima aventura.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Información de Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Teléfono</h4>
                    <p className="text-gray-600">+1 (809) 840-8257</p>
                    <p className="text-sm text-gray-500">WhatsApp disponible</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <p className="text-gray-600">info@jontours.com</p>
                    <p className="text-sm text-gray-500">Respuesta en 24 horas</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Location className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Ubicación</h4>
                    <p className="text-gray-600">Bávaro, Punta Cana</p>
                    <p className="text-sm text-gray-500">República Dominicana</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Horarios</h4>
                    <p className="text-gray-600">7:00 AM - 10:00 PM</p>
                    <p className="text-sm text-gray-500">Todos los días</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Formas Rápidas de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => window.open('https://wa.me/18098408257', '_blank')}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.href = 'tel:+18098408257'}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Llamar Ahora
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.href = 'mailto:info@jontours.com'}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Enviar Email
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Envíanos un Mensaje</CardTitle>
                <CardDescription>
                  Completa el formulario y nos pondremos en contacto contigo lo antes posible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (809) 555-0123"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Asunto *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        placeholder="¿En qué podemos ayudarte?"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensaje *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      placeholder="Cuéntanos más detalles sobre lo que necesitas..."
                      rows={6}
                    />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">💡 Consejos para obtener una respuesta rápida:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Menciona las fechas en las que planeas viajar</li>
                      <li>• Indica el número de personas en tu grupo</li>
                      <li>• Comparte tus intereses específicos (aventura, cultura, playa, etc.)</li>
                      <li>• Si tienes restricciones especiales, háznoslo saber</li>
                    </ul>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-lg py-3"
                    disabled={submitting}
                  >
                    {submitting ? (
                      'Enviando...'
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Enviar Mensaje
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Preguntas Frecuentes</CardTitle>
            <CardDescription className="text-center">
              Respuestas a las preguntas más comunes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-lg mb-2">¿Cuánto tiempo antes debo reservar?</h4>
                  <p className="text-gray-600">
                    Recomendamos reservar al menos 48 horas antes, aunque aceptamos reservas 
                    de último minuto sujetas a disponibilidad.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-2">¿Qué incluyen los tours?</h4>
                  <p className="text-gray-600">
                    Cada tour incluye guía especializado, transporte, y todo lo especificado 
                    en la descripción. Las comidas están incluidas donde se indica.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-2">¿Hay tours privados?</h4>
                  <p className="text-gray-600">
                    Sí, ofrecemos tours privados para grupos. Los precios se ajustan según 
                    el tamaño del grupo y las personalizaciones solicitadas.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-lg mb-2">¿Qué pasa si llueve?</h4>
                  <p className="text-gray-600">
                    Nuestros tours continúan con lluvia ligera. En caso de mal tiempo severo, 
                    reprogramamos sin costo adicional.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-2">¿Recogen en el hotel?</h4>
                  <p className="text-gray-600">
                    Sí, ofrecemos servicio de recogida en la mayoría de hoteles en Punta Cana 
                    y Bávaro. Confirmamos los detalles al reservar.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-2">¿Aceptan grupos grandes?</h4>
                  <p className="text-gray-600">
                    Sí, tenemos experiencia con grupos corporativos y familiares grandes. 
                    Contáctanos para opciones especiales.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sobre Nosotros Section */}
        <section className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sobre Jon Tour & Adventure
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Más de 20 años creando experiencias inolvidables en Punta Cana
            </p>
          </div>

          {/* Historia y Experiencia */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card className="bg-gradient-to-br from-blue-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  Nuestra Historia
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  <strong>Jon Tour & Adventure</strong> nace en el 2021 como una empresa operadora 
                  especializada en ventas de productos vacacionales online y servicios terrestres.
                </p>
                <p className="text-gray-700">
                  Desde el 2002 venimos trabajando para diferentes marcas y empresas dentro de la 
                  industria hotelera y turística en todo Punta Cana, adquiriendo una vasta experiencia.
                </p>
                <div className="bg-blue-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Nuestra Misión</h4>
                  <p className="text-blue-800 text-sm">
                    Apostamos a la buena calidad, responsabilidad y por el buen servicio que cada 
                    quien espera recibir al adquirir un paquete de servicios.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-emerald-600" />
                  Lo Que Ofrecemos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Tours & Excursiones únicas</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    <span className="font-medium">Transporte confiable y cómodo</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-red-600" />
                    <span className="font-medium">Experiencias personalizadas</span>
                  </div>
                </div>
                <div className="bg-emerald-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-emerald-900 mb-2">Nuestro Objetivo</h4>
                  <p className="text-emerald-800 text-sm">
                    Crear experiencias memorables en el corazón de cada visitante con productos 
                    de alta calidad y servicio personalizado.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gerente General */}
          <Card className="max-w-2xl mx-auto mb-12">
            <CardHeader className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-600 to-emerald-600 flex items-center justify-center">
                <Users className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-xl">Jonathan E. Francois</CardTitle>
              <CardDescription className="text-lg">Gerente General</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700 break-all">Jonathanfrancoisg@gmail.com</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Phone className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700">+1-(809)-840-8357</span>
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas */}
          <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl p-8 mb-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Nuestros Logros</h3>
              <p className="text-blue-100">Números que reflejan nuestro compromiso con la excelencia</p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">20+</div>
                <div className="text-blue-100 text-sm">Años de Experiencia</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">1000+</div>
                <div className="text-blue-100 text-sm">Clientes Satisfechos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">15+</div>
                <div className="text-blue-100 text-sm">Tours Únicos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">5.0</div>
                <div className="text-blue-100 text-sm">Rating Promedio</div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <Card className="bg-gradient-to-br from-blue-50 to-emerald-50 text-center">
            <CardContent className="pt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                ¿Listo para tu Aventura en Punta Cana?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Únete a miles de viajeros que han confiado en nosotros para crear 
                experiencias inolvidables en el paraíso caribeño.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-emerald-600"
                  onClick={() => navigate('/')}
                >
                  Ver Tours Disponibles
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => window.open('https://wa.me/18098408257', '_blank')}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
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
