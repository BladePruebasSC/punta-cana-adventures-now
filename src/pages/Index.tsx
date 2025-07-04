
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Clock, Users, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

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

const Index = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'todos', name: 'Todos los Tours', count: 0 },
    { id: 'aventura', name: 'Aventura', count: 0 },
    { id: 'playa', name: 'Playa & Mar', count: 0 },
    { id: 'cultura', name: 'Cultura', count: 0 },
    { id: 'naturaleza', name: 'Naturaleza', count: 0 }
  ];

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setTours(data || []);
      
      // Update category counts
      categories[0].count = data?.length || 0;
      categories.forEach(cat => {
        if (cat.id !== 'todos') {
          cat.count = data?.filter(tour => tour.category === cat.id).length || 0;
        }
      });
    } catch (error) {
      console.error('Error fetching tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTours = selectedCategory === 'todos' 
    ? tours 
    : tours.filter(tour => tour.category === selectedCategory);

  const handleReserveNow = (tourId: string) => {
    navigate(`/reservar/${tourId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  Jon Tours and Adventure
                </h1>
                <p className="text-sm text-gray-600">Experiencias Auténticas</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#tours" className="text-gray-700 hover:text-blue-600 transition-colors">Tours</a>
              <a href="/nosotros" className="text-gray-700 hover:text-blue-600 transition-colors">Nosotros</a>
              <a href="/contacto" className="text-gray-700 hover:text-blue-600 transition-colors">Contacto</a>
              <a href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">Dashboard</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-emerald-900/60"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Descubre el Paraíso
          </h2>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in opacity-90">
            Tours únicos en Punta Cana • Experiencias auténticas • Memorias inolvidables
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input 
                placeholder="Buscar tours, aventuras..." 
                className="pl-10 h-12 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/70"
              />
            </div>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 h-12 px-8">
              Explorar Tours
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>+1000 Reseñas 5★</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Users className="w-4 h-4" />
              <span>Grupos Pequeños</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <MapPin className="w-4 h-4" />
              <span>Guías Locales</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tours Section */}
      <section id="tours" className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-gray-900 mb-4">
            Tours Destacados
          </h3>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Desde aventuras en la selva hasta relajantes días en playas paradisíacas
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`rounded-full ${
                selectedCategory === category.id 
                  ? 'bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700' 
                  : 'hover:bg-blue-50'
              }`}
            >
              {category.name}
              <Badge variant="secondary" className="ml-2">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Tours Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Cargando tours...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTours.map((tour) => (
              <Card key={tour.id} className="group overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="relative overflow-hidden">
                  <img 
                    src={tour.image_url} 
                    alt={tour.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white">
                      ${tour.price}
                    </Badge>
                  </div>
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{tour.rating}</span>
                    </div>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                    {tour.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {tour.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{tour.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{tour.group_size}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {tour.highlights.map((highlight, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
                    onClick={() => handleReserveNow(tour.id)}
                  >
                    Reservar Ahora
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-emerald-600 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h3 className="text-4xl font-bold mb-4">
            ¿Listo para tu Aventura?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Contacta con nuestros expertos locales para crear tu experiencia perfecta
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              WhatsApp +1 (809) 555-0123
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Email: info@jontours.com
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Jon Tours and Adventure</span>
            </div>
            <p className="text-gray-400">
              Tu compañía de confianza para explorar lo mejor de República Dominicana.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Tours Populares</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Saona Island</li>
              <li>Safari Aventura</li>
              <li>Hoyo Azul</li>
              <li>Santo Domingo</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Servicios</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Tours Privados</li>
              <li>Grupos Corporativos</li>
              <li>Transporte</li>
              <li>Guías Certificados</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-gray-400">
              <li>📱 +1 (809) 555-0123</li>
              <li>✉️ info@jontours.com</li>
              <li>📍 Bávaro, Punta Cana</li>
              <li>🕒 7:00 AM - 10:00 PM</li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; 2024 Jon Tours and Adventure. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
