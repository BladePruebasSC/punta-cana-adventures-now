
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Clock, Users, Filter, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
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

interface TourImage {
  id: string;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  order_index: number;
  tour_id: string;
}

interface Category {
  id: string;
  name: string;
  count: number;
}

const Index = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [tours, setTours] = useState<Tour[]>([]);
  const [tourImages, setTourImages] = useState<Record<string, TourImage[]>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([
    { id: 'todos', name: 'Todos los Tours', count: 0 },
    { id: 'aventura', name: 'Aventura', count: 0 },
    { id: 'playa', name: 'Playa & Mar', count: 0 },
    { id: 'cultura', name: 'Cultura', count: 0 },
    { id: 'naturaleza', name: 'Naturaleza', count: 0 }
  ]);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      // Fetch tours
      const { data: toursData, error: toursError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (toursError) throw toursError;
      
      setTours(toursData || []);
      
      // Fetch all tour images
      const { data: imagesData, error: imagesError } = await supabase
        .from('tour_images')
        .select('*')
        .order('order_index', { ascending: true });

      if (imagesError) throw imagesError;

      // Group images by tour_id
      const imagesByTour: Record<string, TourImage[]> = {};
      (imagesData || []).forEach(image => {
        if (!imagesByTour[image.tour_id]) {
          imagesByTour[image.tour_id] = [];
        }
        imagesByTour[image.tour_id].push(image);
      });
      
      setTourImages(imagesByTour);
      
      // Update category counts with actual data
      const updatedCategories = categories.map(cat => {
        if (cat.id === 'todos') {
          return { ...cat, count: toursData?.length || 0 };
        } else {
          const count = toursData?.filter(tour => tour.category === cat.id).length || 0;
          return { ...cat, count };
        }
      });
      
      setCategories(updatedCategories);
    } catch (error) {
      console.error('Error fetching tours:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter tours based on search term and selected category
  const filteredTours = tours.filter(tour => {
    // Filter by category
    const matchesCategory = selectedCategory === 'todos' || tour.category === selectedCategory;
    
    // Filter by search term
    const matchesSearch = searchTerm === '' || 
      tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.highlights.some(highlight => 
        highlight.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    return matchesCategory && matchesSearch;
  });

  const handleReserveNow = (tourId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    navigate(`/reservar/${tourId}`);
  };

  const handleTourClick = (tourId: string) => {
    navigate(`/reservar/${tourId}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Scroll to tours section when search is performed
    const toursSection = document.getElementById('tours');
    if (toursSection) {
      toursSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = '18098408257';
    const message = encodeURIComponent('Hola, me interesa información sobre sus tours en Punta Cana');
    
    // iOS-friendly WhatsApp redirect
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      // For iOS, use whatsapp:// protocol first, fallback to web
      window.location.href = `whatsapp://send?phone=${phoneNumber}&text=${message}`;
      
      // Fallback to web version after a short delay if the app doesn't open
      setTimeout(() => {
        window.open(`https://web.whatsapp.com/send?phone=${phoneNumber}&text=${message}`, '_blank');
      }, 1000);
    } else {
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    }
  };

  const handleEmailClick = () => {
    const email = 'info@jontours.com';
    const subject = encodeURIComponent('Consulta sobre Tours en Punta Cana');
    const body = encodeURIComponent('Hola,\n\nMe interesa obtener más información sobre sus tours en Punta Cana.\n\nGracias');
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
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
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#tours" className="text-gray-700 hover:text-blue-600 transition-colors">Tours</a>
              <a href="/nosotros" className="text-gray-700 hover:text-blue-600 transition-colors">Nosotros</a>
              <a href="/contacto" className="text-gray-700 hover:text-blue-600 transition-colors">Contacto</a>
              <a href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">Dashboard</a>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col space-y-4">
                <a 
                  href="#tours" 
                  className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tours
                </a>
                <a 
                  href="/nosotros" 
                  className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Nosotros
                </a>
                <a 
                  href="/contacto" 
                  className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contacto
                </a>
                <a 
                  href="/dashboard" 
                  className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </a>
              </nav>
            </div>
          )}
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
          
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input 
                placeholder="Buscar tours, aventuras..." 
                className="pl-10 h-12 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/70"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <Button 
              type="submit"
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 h-12 px-8"
            >
              Explorar Tours
            </Button>
          </form>

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

        {/* Search Results Info */}
        {searchTerm && (
          <div className="mb-6 text-center">
            <p className="text-gray-600">
              {filteredTours.length > 0 
                ? `${filteredTours.length} tour${filteredTours.length === 1 ? '' : 's'} encontrado${filteredTours.length === 1 ? '' : 's'} para "${searchTerm}"`
                : `No se encontraron tours para "${searchTerm}"`
              }
            </p>
            {searchTerm && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchTerm('')}
                className="mt-2"
              >
                Limpiar búsqueda
              </Button>
            )}
          </div>
        )}

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
        ) : filteredTours.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">
              {searchTerm ? 'No se encontraron tours que coincidan con tu búsqueda.' : 'No hay tours disponibles en esta categoría.'}
            </p>
            {(searchTerm || selectedCategory !== 'todos') && (
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('todos');
                }}
                className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
              >
                Ver todos los tours
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTours.map((tour) => {
              const images = tourImages[tour.id] || [];
              const displayImages = images.length > 0 ? images : [{ id: 'default', image_url: tour.image_url, alt_text: tour.title, is_primary: true, order_index: 0, tour_id: tour.id }];
              
              return (
                <Card 
                  key={tour.id} 
                  className="group overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                  onClick={() => handleTourClick(tour.id)}
                >
                  <div className="relative overflow-hidden">
                    {displayImages.length > 1 ? (
                      <div onClick={(e) => e.stopPropagation()}>
                        <Carousel className="w-full">
                          <CarouselContent>
                            {displayImages.map((image, index) => (
                              <CarouselItem key={image.id || index}>
                                <img 
                                  src={image.image_url} 
                                  alt={image.alt_text || tour.title}
                                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious className="left-2" />
                          <CarouselNext className="right-2" />
                        </Carousel>
                      </div>
                    ) : (
                      <img 
                        src={displayImages[0].image_url} 
                        alt={displayImages[0].alt_text || tour.title}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                    
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
                    
                    {displayImages.length > 1 && (
                      <div className="absolute bottom-4 right-4">
                        <Badge variant="secondary" className="text-xs">
                          📸 {displayImages.length} fotos
                        </Badge>
                      </div>
                    )}
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
                      onClick={(e) => handleReserveNow(tour.id, e)}
                    >
                      Reservar Ahora
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
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
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={handleWhatsAppClick}
            >
              WhatsApp +1 (809) 840-8257
            </Button>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={handleEmailClick}
            >
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
              <li>📱 +1 (809) 840-8257</li>
              <li>✉️ info@jontours.com</li>
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
