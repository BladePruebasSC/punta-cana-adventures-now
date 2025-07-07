
import React from 'react';
import { MapPin, Phone, Mail, Clock, Award, Users, Heart, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const Nosotros = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Jon Tours</span>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Button variant="ghost" onClick={() => navigate('/')}>Inicio</Button>
              <Button variant="ghost" onClick={() => navigate('/contacto')}>Contacto</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Nuestra Historia
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Más de una década creando experiencias inolvidables en República Dominicana
          </p>
          <img 
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80"
            alt="Equipo Jon Tours"
            className="w-full h-96 object-cover rounded-2xl shadow-2xl"
          />
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                La Visión de Jon
              </h2>
              <p className="text-gray-600 mb-4">
                Jon Tours nació de la pasión de nuestro fundador, Jon Rodríguez, por mostrar las 
                maravillas ocultas de República Dominicana. Después de años trabajando como guía 
                turístico independiente, Jon decidió crear una empresa que ofreciera experiencias 
                auténticas y personalizadas.
              </p>
              <p className="text-gray-600 mb-4">
                "Mi objetivo siempre ha sido que cada visitante se sienta como un amigo explorando 
                mi hogar, no como un turista más", dice Jon. Esta filosofía ha sido el corazón de 
                nuestra empresa desde el primer día.
              </p>
              <p className="text-gray-600">
                Hoy, más de 10 años después, hemos tenido el privilegio de guiar a miles de 
                viajeros de todo el mundo, creando memorias que perduran toda la vida.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80"
                alt="Jon Rodríguez, Fundador"
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
                <p className="font-semibold text-gray-900">Jon Rodríguez</p>
                <p className="text-sm text-gray-600">Fundador & Guía Principal</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nuestros Valores
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Los principios que guían cada tour y experiencia que ofrecemos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <CardTitle className="text-lg">Pasión</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Amamos lo que hacemos y esa pasión se refleja en cada experiencia.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Award className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <CardTitle className="text-lg">Excelencia</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Nos esforzamos por superar las expectativas en cada detalle.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <CardTitle className="text-lg">Familia</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Tratamos a cada huésped como parte de nuestra familia dominicana.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Globe className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <CardTitle className="text-lg">Sostenibilidad</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Protegemos y preservamos la belleza natural de nuestro país.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-emerald-600">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Nuestros Logros
            </h2>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Números que reflejan nuestro compromiso con la excelencia
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">10+</div>
              <div className="text-blue-100">Años de Experiencia</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">5000+</div>
              <div className="text-blue-100">Clientes Satisfechos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">15+</div>
              <div className="text-blue-100">Tours Únicos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">4.9</div>
              <div className="text-blue-100">Rating Promedio</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nuestro Equipo
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Guías expertos apasionados por compartir la cultura dominicana
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80"
                alt="Carlos Méndez"
                className="w-full h-64 object-cover rounded-t-lg"
              />
              <CardHeader>
                <CardTitle>Carlos Méndez</CardTitle>
                <CardDescription>Guía Senior - Especialista en Historia</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  15 años de experiencia compartiendo la rica historia dominicana.
                </p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary">Historia</Badge>
                  <Badge variant="secondary">Cultura</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <img 
                src="https://images.unsplash.com/photo-1494790108755-2616c78ab890?auto=format&fit=crop&w=300&q=80"
                alt="María González"
                className="w-full h-64 object-cover rounded-t-lg"
              />
              <CardHeader>
                <CardTitle>María González</CardTitle>
                <CardDescription>Guía de Aventura - Experta en Ecoturismo</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Bióloga marina especializada en tours de naturaleza y aventura.
                </p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary">Aventura</Badge>
                  <Badge variant="secondary">Naturaleza</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
                alt="Roberto Silva"
                className="w-full h-64 object-cover rounded-t-lg"
              />
              <CardHeader>
                <CardTitle>Roberto Silva</CardTitle>
                <CardDescription>Guía de Playa - Especialista Acuático</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Instructor de buceo certificado con pasión por los deportes acuáticos.
                </p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary">Buceo</Badge>
                  <Badge variant="secondary">Playa</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            ¿Listo para tu Aventura?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col items-center">
              <Phone className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">Llámanos</h3>
              <p className="text-gray-600">+1 (809) 840-8257</p>
            </div>
            
            <div className="flex flex-col items-center">
              <Mail className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">Escríbenos</h3>
              <p className="text-gray-600">info@jontours.com</p>
            </div>
            
            <div className="flex flex-col items-center">
              <Clock className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">Horarios</h3>
              <p className="text-gray-600">24/7 Disponible</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-emerald-600"
              onClick={() => navigate('/contacto')}
            >
              Contáctanos Ahora
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/')}
            >
              Ver Tours Disponibles
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Jon Tours</span>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400">
                © 2024 Jon Tours. Todos los derechos reservados.
              </p>
              <p className="text-gray-400 text-sm">
                Creando memorias inolvidables en República Dominicana
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Nosotros;
