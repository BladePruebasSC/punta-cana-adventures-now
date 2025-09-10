
import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Award, Users, Heart, Globe, Calendar, Star, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Nosotros = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [nosotrosImages, setNosotrosImages] = useState({
    hero: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
    inicios: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=500&q=80',
    experiencia: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=500&q=80'
  });

  useEffect(() => {
    const fetchNosotrosImages = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('setting_key, setting_value')
          .in('setting_key', ['nosotros_hero_image', 'nosotros_inicios_image', 'nosotros_experiencia_image']);

        if (error) {
          console.error('Error fetching nosotros images:', error);
          return;
        }

        const images = {
          hero: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
          inicios: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=500&q=80',
          experiencia: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=500&q=80'
        };

        data?.forEach(setting => {
          if (setting.setting_key === 'nosotros_hero_image' && setting.setting_value) {
            images.hero = setting.setting_value;
          } else if (setting.setting_key === 'nosotros_inicios_image' && setting.setting_value) {
            images.inicios = setting.setting_value;
          } else if (setting.setting_key === 'nosotros_experiencia_image' && setting.setting_value) {
            images.experiencia = setting.setting_value;
          }
        });

        setNosotrosImages(images);
      } catch (error) {
        console.error('Error fetching nosotros images:', error);
      }
    };

    fetchNosotrosImages();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center">
                <MapPin className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900">Jon Tour Punta Cana</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              <Button variant="ghost" onClick={() => navigate('/')}>Inicio</Button>
              <Button variant="ghost" onClick={() => navigate('/contacto')}>Contacto</Button>
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-2">
                <Button 
                  variant="ghost" 
                  className="justify-start text-left"
                  onClick={() => {
                    navigate('/');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Inicio
                </Button>
                <Button 
                  variant="ghost" 
                  className="justify-start text-left"
                  onClick={() => {
                    navigate('/contacto');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Contacto
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Nuestra Historia
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 px-4">
            Más de dos décadas creando experiencias inolvidables en Punta Cana
          </p>
          <div className="relative">
            <img 
              src={nosotrosImages.hero}
              alt="Playa tropical de Punta Cana con resort y actividades acuáticas"
              className="w-full h-48 sm:h-64 lg:h-96 object-cover rounded-xl sm:rounded-2xl shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Inicios */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Nuestros Inicios
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-blue-600 to-emerald-600 mx-auto mb-4 sm:mb-6"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                Jon Tour Punta Cana nace en el 2021
              </h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                Como una empresa operadora especializada en ventas de productos vacacionales online 
                y servicios terrestres. Nos dedicamos a ofrecer tours, excursiones, transporte y 
                experiencias vacacionales de la más alta calidad.
              </p>
              
              <div className="bg-blue-50 p-4 sm:p-6 rounded-lg border-l-4 border-blue-600">
                <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">¿Por qué damos inicio?</h4>
                <p className="text-gray-700 text-sm sm:text-base">
                  A partir de una gran necesidad que descubrimos que estaba creciendo en Punta Cana 
                  así como en otras partes del mundo. Vimos que muchas personas y empresas solo se 
                  enfocan en vender diferentes tipos de artículos, productos o servicios, pero no 
                  todas se preocupan por ofrecer un servicio de primera, personalizado y de alta calidad. 
                  Partiendo de esta gran necesidad, surge <strong>JON TOUR & ADVENTURE</strong>.
                </p>
              </div>
            </div>
            
            <div className="relative order-1 lg:order-2">
              <img 
                src={nosotrosImages.inicios}
                alt="Actividades acuáticas y snorkel en aguas cristalinas de Punta Cana"
                className="w-full h-48 sm:h-64 lg:h-96 object-cover rounded-xl sm:rounded-2xl shadow-lg"
              />
              <div className="absolute -bottom-3 -left-3 sm:-bottom-6 sm:-left-6 bg-white p-3 sm:p-4 rounded-lg shadow-lg">
                <p className="font-semibold text-gray-900 text-sm sm:text-base">Punta Cana</p>
                <p className="text-xs sm:text-sm text-gray-600">Nuestro Destino Turístico</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experiencia */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Nuestra Experiencia
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-blue-600 to-emerald-600 mx-auto mb-4 sm:mb-6"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="relative order-1">
              <img 
                src={nosotrosImages.experiencia}
                alt="Resort y playa tropical de Punta Cana con actividades acuáticas"
                className="w-full h-48 sm:h-64 lg:h-96 object-cover rounded-xl sm:rounded-2xl shadow-lg"
              />
              <div className="absolute -bottom-3 -right-3 sm:-bottom-6 sm:-right-6 bg-white p-3 sm:p-4 rounded-lg shadow-lg">
                <p className="font-semibold text-gray-900 text-sm sm:text-base">Desde 2002</p>
                <p className="text-xs sm:text-sm text-gray-600">Años de Experiencia</p>
              </div>
            </div>
            
            <div className="order-2">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                Más de 20 años en la industria
              </h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                Desde el 2002 venimos trabajando para diferentes marcas y empresas dentro de la 
                industria hotelera y turística en todo Punta Cana. Esto nos llevó a adquirir una 
                gran y vasta experiencia dentro y fuera de la industria turística.
              </p>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                Esta experiencia nos motivó a poner en marcha nuestro proyecto de ventas de tours 
                bajo el marco de los mejores precios, calidad y mejor servicio.
              </p>
              
              <div className="bg-emerald-50 p-4 sm:p-6 rounded-lg border-l-4 border-emerald-600">
                <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Nuestra Misión</h4>
                <p className="text-gray-700 text-sm sm:text-base">
                  Apostamos a la buena calidad, responsabilidad y por el buen servicio que cada 
                  quien espera recibir al adquirir o comprar un paquete de servicios. De esta 
                  manera buscamos mantener vigente e intacto el buen desarrollo de nuestro 
                  destino turístico, Punta Cana, y la mayor experiencia y satisfacción de cada 
                  persona que nos visita.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Que Ofrecemos */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              ¿Qué Ofrecemos?
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-blue-600 to-emerald-600 mx-auto mb-4 sm:mb-6"></div>
            <p className="text-gray-600 max-w-3xl mx-auto text-sm sm:text-base px-4">
              A través de las ventas y servicios de tours, excursiones y transporte, prometemos 
              y garantizamos a cada uno de nuestros clientes mágicas vivencias y a la vez 
              experiencias memorables de satisfacción sin límites.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3 sm:pb-4">
                <Globe className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500 mx-auto mb-3 sm:mb-4" />
                <CardTitle className="text-base sm:text-lg">Tours & Excursiones</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm sm:text-base">
                  Experiencias únicas y personalizadas que te permitirán descubrir los secretos 
                  más hermosos de Punta Cana y sus alrededores.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3 sm:pb-4">
                <MapPin className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-500 mx-auto mb-3 sm:mb-4" />
                <CardTitle className="text-base sm:text-lg">Transporte</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm sm:text-base">
                  Servicio de transporte confiable y cómodo para todos nuestros tours y excursiones, 
                  con vehículos modernos y conductores profesionales.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
              <CardHeader className="pb-3 sm:pb-4">
                <Star className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-500 mx-auto mb-3 sm:mb-4" />
                <CardTitle className="text-base sm:text-lg">Experiencias Vacacionales</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm sm:text-base">
                  Paquetes completos que combinan alojamiento, tours y actividades para crear 
                  vacaciones inolvidables en el paraíso caribeño.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Objetivo */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">
            Nuestro Objetivo
          </h2>
          <div className="bg-white/10 backdrop-blur-sm p-6 sm:p-8 rounded-xl sm:rounded-2xl">
            <p className="text-lg sm:text-xl text-white leading-relaxed">
              Crear experiencias memorables en el corazón de cada visitante que consuman nuestros 
              productos y servicios. Para ello nos enfocamos en ofrecer productos de alta calidad, 
              con responsabilidad y servicio personalizado hacia cada cliente.
            </p>
          </div>
        </div>
      </section>

      {/* Gerente General */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Nuestro Líder
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-blue-600 to-emerald-600 mx-auto mb-4 sm:mb-6"></div>
          </div>
          
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center pb-4 sm:pb-6">
              <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-r from-blue-600 to-emerald-600 flex items-center justify-center">
                <Users className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
              </div>
              <CardTitle className="text-xl sm:text-2xl">Jonathan E. Francois</CardTitle>
              <CardDescription className="text-base sm:text-lg">Gerente General</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <span className="text-gray-700 text-sm sm:text-base break-all">jontourpuntacana@gmail.com</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <span className="text-gray-700 text-sm sm:text-base">+1-(809)-840-8357</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-emerald-600">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
              Nuestros Logros
            </h2>
            <p className="text-blue-100 max-w-2xl mx-auto text-sm sm:text-base">
              Números que reflejan nuestro compromiso con la excelencia
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">20+</div>
              <div className="text-blue-100 text-sm sm:text-base">Años de Experiencia</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">1000+</div>
              <div className="text-blue-100 text-sm sm:text-base">Clientes Satisfechos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">15+</div>
              <div className="text-blue-100 text-sm sm:text-base">Tours Únicos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">5.0</div>
              <div className="text-blue-100 text-sm sm:text-base">Rating Promedio</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
            ¿Listo para tu Aventura?
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="flex flex-col items-center">
              <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Llámanos</h3>
              <p className="text-gray-600 text-sm sm:text-base">+1-(809)-840-8357</p>
            </div>
            
            <div className="flex flex-col items-center">
              <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Escríbenos</h3>
              <p className="text-gray-600 text-sm sm:text-base break-all">jfcaribe</p>
            </div>
            
            <div className="flex flex-col items-center">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Horarios</h3>
              <p className="text-gray-600 text-sm sm:text-base">24/7 Disponible</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-emerald-600 w-full sm:w-auto"
              onClick={() => navigate('/contacto')}
            >
              Contáctanos Ahora
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => navigate('/')}
            >
              Ver Tours Disponibles
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center">
                <MapPin className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold">Jon Tour Punta Cana</span>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm sm:text-base">
                © 2024 Jon Tour Punta Cana. Todos los derechos reservados.
              </p>
              <p className="text-gray-400 text-xs sm:text-sm">
                Creando experiencias memorables en Punta Cana desde 2021
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Nosotros;
