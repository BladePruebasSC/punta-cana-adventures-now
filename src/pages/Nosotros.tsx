
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeft, Users, Award, Heart, Compass, Phone, Mail, MapPin as Location } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Nosotros = () => {
  const navigate = useNavigate();

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
            Sobre Nosotros
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Somos más que una empresa de tours. Somos apasionados por mostrar la verdadera belleza 
            y cultura de República Dominicana a través de experiencias auténticas e inolvidables.
          </p>
        </div>

        {/* Main Story */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestra Historia</h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  Jon Tours and Adventure nació del sueño de compartir las maravillas escondidas de 
                  República Dominicana con viajeros de todo el mundo. Fundada por Jon, un guía local 
                  con más de 15 años de experiencia, nuestra empresa se ha convertido en sinónimo 
                  de calidad, aventura y autenticidad.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  Lo que comenzó como tours informales para amigos y familiares, ha evolucionado 
                  hasta convertirse en una empresa de turismo reconocida que ha guiado a miles de 
                  visitantes a través de las más impresionantes experiencias que nuestro país caribeño 
                  tiene para ofrecer.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Cada tour es diseñado cuidadosamente para mostrar no solo los lugares más hermosos, 
                  sino también la rica cultura, historia y tradiciones que hacen única a República Dominicana.
                </p>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Paisaje dominicano"
                  className="rounded-lg shadow-lg w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pasión</h3>
              <p className="text-gray-600">
                Amamos lo que hacemos y se nota en cada detalle de nuestros tours.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Experiencia</h3>
              <p className="text-gray-600">
                Más de 15 años guiando visitantes por los mejores destinos.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Calidad</h3>
              <p className="text-gray-600">
                Comprometidos con ofrecer siempre el mejor servicio y experiencias.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Compass className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Aventura</h3>
              <p className="text-gray-600">
                Cada tour es una nueva aventura llena de descubrimientos únicos.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mission and Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Nuestra Misión</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-lg leading-relaxed">
                Proporcionar experiencias de turismo excepcionales que conecten a nuestros visitantes 
                con la auténtica belleza natural, cultural e histórica de República Dominicana, 
                mientras promovemos el turismo sostenible y apoyamos a las comunidades locales.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Nuestra Visión</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-lg leading-relaxed">
                Ser reconocidos como la empresa líder en turismo de aventura en República Dominicana, 
                conocidos por nuestra excelencia en el servicio, nuestro compromiso con la sostenibilidad 
                y por crear memorias que duren toda la vida en cada uno de nuestros huéspedes.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Why Choose Us */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-3xl text-center">¿Por Qué Elegirnos?</CardTitle>
            <CardDescription className="text-center text-lg">
              Lo que nos hace diferentes del resto
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Guías Locales Expertos</h4>
                    <p className="text-gray-600">
                      Nuestros guías nacieron y crecieron aquí. Conocen cada historia, 
                      cada secreto y cada rincón especial.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Grupos Pequeños</h4>
                    <p className="text-gray-600">
                      Mantenemos grupos reducidos para asegurar una experiencia 
                      personalizada y de mayor calidad.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Turismo Sostenible</h4>
                    <p className="text-gray-600">
                      Nos comprometemos con prácticas responsables que protegen 
                      nuestro entorno natural y benefician a las comunidades locales.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Experiencias Auténticas</h4>
                    <p className="text-gray-600">
                      Evitamos las trampas turísticas. Te llevamos a lugares reales 
                      donde vive y respira la verdadera cultura dominicana.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 font-bold">5</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Servicio Personalizado</h4>
                    <p className="text-gray-600">
                      Cada tour se adapta a los intereses y necesidades específicas 
                      de nuestros huéspedes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 font-bold">6</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Seguridad Garantizada</h4>
                    <p className="text-gray-600">
                      Tu seguridad es nuestra prioridad. Todos nuestros tours cumplen 
                      con los más altos estándares de seguridad.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-center">¡Conectemos!</CardTitle>
            <CardDescription className="text-center text-lg">
              Estamos aquí para hacer realidad tu próxima aventura
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">Llámanos</h4>
                  <p className="text-gray-600">+1 (809) 555-0123</p>
                  <p className="text-sm text-gray-500">Disponible 7:00 AM - 10:00 PM</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">Escríbenos</h4>
                  <p className="text-gray-600">info@jontours.com</p>
                  <p className="text-sm text-gray-500">Respuesta en 24 horas</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Location className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">Visítanos</h4>
                  <p className="text-gray-600">Bávaro, Punta Cana</p>
                  <p className="text-sm text-gray-500">República Dominicana</p>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <Button 
                onClick={() => navigate('/contacto')} 
                className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 px-8 py-3"
              >
                Contáctanos Ahora
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Nosotros;
