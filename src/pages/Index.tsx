import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, MapPin, Star, Clock, Users, Filter, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { supabase } from '@/integrations/supabase/client';
import { toursCache, tourImagesCache, siteSettingsCache, CACHE_KEYS, CACHE_TTL } from '@/lib/cache';
import { preloadTourImages } from '@/lib/imagePreloader';
import { useNavigate } from 'react-router-dom';
import TourCard from '@/components/TourCard';
import TourDetailModal from '@/components/TourDetailModal';
import TransportationSection from '@/components/TransportationSection';
import WhatsAppIcon from '@/components/ui/whatsapp-icon';

interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: string;
}

// Translation system
const translations = {
  es: {
    heroTitle: "EXPLORA TODO PUNTA CANA AHORA",
    heroSubtitle: "Transportación • Tours • Excursiones • Experiencias Inolvidables",
    searchPlaceholder: "Buscar tours, aventuras...",
    exploreButton: "Explorar Tours",
    reviews: "+1000 Reseñas 5★",
    smallGroups: "Grupos Pequeños",
    localGuides: "Guías Locales",
    featuredTours: "Tours Destacados",
    featuredSubtitle: "Disfruta de las mejores actividades y aventuras de Punta Cana. Con la mejor calidad, mejores precios y Servicios Garantizados",
    allTours: "Todos los Tours",
    adventure: "Aventura",
    beach: "Playa & Mar",
    culture: "Cultura",
    nature: "Naturaleza",
    toursFound: "tours encontrados para",
    noToursFound: "No se encontraron tours para",
    clearSearch: "Limpiar búsqueda",
    loadingTours: "Cargando tours...",
    noToursCategory: "No hay tours disponibles en esta categoría.",
    noToursSearch: "No se encontraron tours que coincidan con tu búsqueda.",
    viewAllTours: "Ver todos los tours",
    reserveNow: "Reservar Ahora",
    photos: "fotos",
    readyForAdventure: "¿Listo para tu Aventura?",
    contactExperts: "Contacta con nuestros expertos locales para crear tu experiencia perfecta",
    popularTours: "Tours Populares",
    services: "Servicios",
    contact: "Contacto",
    privateTours: "Tours Privados",
    corporateGroups: "Grupos Corporativos",
    transportation: "Transporte",
    certifiedGuides: "Guías Certificados",
    copyright: "© 2024 Jon Tour Punta Cana. Todos los derechos reservados.",
    authenticExperiences: "Experiencias Auténticas",
    saonaIsland: "Isla Saona",
    safariAdventure: "Safari Aventura",
    blueHole: "Hoyo Azul",
    santoDomingo: "Santo Domingo",
    hours: "7:00 AM - 10:00 PM"
  },
  en: {
    heroTitle: "RESERVE YOUR TOUR HERE NOW",
    heroSubtitle: "Transportation • Tours • Excursions • Unforgettable Experiences",
    searchPlaceholder: "Search tours, adventures...",
    exploreButton: "Explore Tours",
    reviews: "+1000 5★ Reviews",
    smallGroups: "Small Groups",
    localGuides: "Local Guides",
    featuredTours: "Featured Tours",
    featuredSubtitle: "From jungle adventures to relaxing days on paradise beaches",
    allTours: "All Tours",
    adventure: "Adventure",
    beach: "Beach & Sea",
    culture: "Culture",
    nature: "Nature",
    toursFound: "tours found for",
    noToursFound: "No tours found for",
    clearSearch: "Clear search",
    loadingTours: "Loading tours...",
    noToursCategory: "No tours available in this category.",
    noToursSearch: "No tours found matching your search.",
    viewAllTours: "View all tours",
    reserveNow: "Reserve Now",
    photos: "photos",
    readyForAdventure: "Ready for Your Adventure?",
    contactExperts: "Contact our local experts to create your perfect experience",
    popularTours: "Popular Tours",
    services: "Services",
    contact: "Contact",
    privateTours: "Private Tours",
    corporateGroups: "Corporate Groups",
    transportation: "Transportation",
    certifiedGuides: "Certified Guides",
    copyright: "© 2024 Jon Tour Punta Cana. All rights reserved.",
    authenticExperiences: "Authentic Experiences",
    saonaIsland: "Saona Island",
    safariAdventure: "Safari Adventure",
    blueHole: "Blue Hole",
    santoDomingo: "Santo Domingo",
    hours: "7:00 AM - 10:00 PM"
  },
  fr: {
    heroTitle: "RÉSERVEZ VOTRE TOUR ICI MAINTENANT",
    heroSubtitle: "Transport • Circuits • Excursions • Expériences Inoubliables",
    searchPlaceholder: "Rechercher des circuits, aventures...",
    exploreButton: "Explorer les Circuits",
    reviews: "+1000 Avis 5★",
    smallGroups: "Petits Groupes",
    localGuides: "Guides Locaux",
    featuredTours: "Circuits Vedettes",
    featuredSubtitle: "Des aventures dans la jungle aux journées relaxantes sur les plages paradisiaques",
    allTours: "Tous les Circuits",
    adventure: "Aventure",
    beach: "Plage & Mer",
    culture: "Culture",
    nature: "Nature",
    toursFound: "circuits trouvés pour",
    noToursFound: "Aucun circuit trouvé pour",
    clearSearch: "Effacer la recherche",
    loadingTours: "Chargement des circuits...",
    noToursCategory: "Aucun circuit disponible dans cette catégorie.",
    noToursSearch: "Aucun circuit trouvé correspondant à votre recherche.",
    viewAllTours: "Voir tous les circuits",
    reserveNow: "Réserver Maintenant",
    photos: "photos",
    readyForAdventure: "Prêt pour Votre Aventure?",
    contactExperts: "Contactez nos experts locaux pour créer votre expérience parfaite",
    popularTours: "Circuits Populaires",
    services: "Services",
    contact: "Contact",
    privateTours: "Circuits Privés",
    corporateGroups: "Groupes d'Entreprise",
    transportation: "Transport",
    certifiedGuides: "Guides Certifiés",
    copyright: "© 2024 Jon Tour Punta Cana. Tous droits réservés.",
    authenticExperiences: "Expériences Authentiques",
    saonaIsland: "Île Saona",
    safariAdventure: "Safari Aventure",
    blueHole: "Trou Bleu",
    santoDomingo: "Saint-Domingue",
    hours: "7:00 AM - 10:00 PM"
  }
};

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
  
  // Language detection and translation
  const [currentLanguage, setCurrentLanguage] = useState('es');
  
  const t = useMemo(() => {
    return translations[currentLanguage as keyof typeof translations] || translations.es;
  }, [currentLanguage]);
  
  useEffect(() => {
    // Detect browser language
    const browserLang = navigator.language.split('-')[0];
    const supportedLanguages = ['es', 'en', 'fr'];
    const detectedLang = supportedLanguages.includes(browserLang) ? browserLang : 'es';
    setCurrentLanguage(detectedLang);
  }, []);

  // Update categories when language changes
  useEffect(() => {
    setCategories([
      { id: 'todos', name: t.allTours, count: 0 },
      { id: 'aventura', name: t.adventure, count: 0 },
      { id: 'playa', name: t.beach, count: 0 },
      { id: 'cultura', name: t.culture, count: 0 },
      { id: 'naturaleza', name: t.nature, count: 0 }
    ]);
  }, [t]);

  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [tours, setTours] = useState<Tour[]>([]);
  const [tourImages, setTourImages] = useState<Record<string, TourImage[]>>({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  const [keySequence, setKeySequence] = useState('');
  const [categories, setCategories] = useState<Category[]>([
    { id: 'todos', name: t.allTours, count: 0 },
    { id: 'aventura', name: t.adventure, count: 0 },
    { id: 'playa', name: t.beach, count: 0 },
    { id: 'cultura', name: t.culture, count: 0 },
    { id: 'naturaleza', name: t.nature, count: 0 }
  ]);

  // Carga ultra-rápida de datos - mostrar contenido inmediatamente
  useEffect(() => {
    const loadData = async () => {
      try {
        // Verificar caché primero - esto debería ser instantáneo
        const cachedTours = toursCache.get<Tour[]>(CACHE_KEYS.TOURS);
        const cachedImages = tourImagesCache.get<Record<string, TourImage[]>>(CACHE_KEYS.TOUR_IMAGES);
        
        if (cachedTours && cachedImages) {
          console.log('🚀 Using cached data - Instant load!');
          setTours(cachedTours);
          setTourImages(cachedImages);
          setLoading(false);
          return;
        }

        // Mostrar contenido básico inmediatamente - sin esperar datos de BD
        console.log('⚡ Showing basic content immediately...');
        const basicTours: Tour[] = [
          {
            id: '1',
            title: 'Isla Saona',
            description: 'Disfruta de las mejores playas del Caribe',
            image_url: '/src/assets/tour-saona-island.jpg',
            price: 45,
            duration: '8 horas',
            rating: 4.8,
            category: 'playa',
            group_size: '2-50 personas',
            highlights: ['Playa paradisíaca', 'Aguas cristalinas', 'Almuerzo en la playa']
          },
          {
            id: '2',
            title: 'Hoyo Azul',
            description: 'Aventura en el corazón de la selva tropical',
            image_url: '/src/assets/tour-hoyo-azul.jpg',
            price: 65,
            duration: '6 horas',
            rating: 4.9,
            category: 'aventura',
            group_size: '2-20 personas',
            highlights: ['Cenote natural', 'Caminata ecológica', 'Aguas turquesas']
          },
          {
            id: '3',
            title: 'Safari Aventura',
            description: 'Descubre la República Dominicana auténtica',

            price: 55,
            duration: '7 horas',
            rating: 4.7,
            category: 'aventura',
            group_size: '4-16 personas',
            highlights: ['Pueblos auténticos', 'Paisajes naturales', 'Cultura local']
          }
        ];
        
        setTours(basicTours);
        setLoading(false);
        console.log('✅ Basic content shown immediately');

        // Cargar datos reales de la base de datos en segundo plano
        setTimeout(async () => {
          try {
            console.log('📡 Loading real data from database in background...');
            
            // Cargar solo los metadatos esenciales, sin imágenes base64 pesadas
            const { data: toursData, error: toursError } = await supabase
              .from('posts')
              .select('id, title, description, price, duration, category')
              .order('created_at', { ascending: false });

            if (toursError) throw toursError;

            if (toursData && toursData.length > 0) {

            }

          } catch (error) {
            console.error('Error loading background data:', error);
          }
        }, 100);

      } catch (error) {
        console.error('Error in data loading:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Actualizar conteos de categorías cuando los tours cambien
  useEffect(() => {
    if (tours.length > 0) {
      const tourCount = tours.length;
      const categoryCounts = tours.reduce((acc, tour) => {
        acc[tour.category] = (acc[tour.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      setCategories(prevCategories => {
        const updatedCategories = prevCategories.map(cat => {
          if (cat.id === 'todos') {
            return { ...cat, count: tourCount };
          } else {
            return { ...cat, count: categoryCounts[cat.id] || 0 };
          }
        });
        return updatedCategories;
      });
      
      // Precargar imágenes de los tours
      preloadTourImages(tours);
    }
  }, [tours]); // Removed categories from dependencies

  // Keyboard listener for dashboard access
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const newSequence = keySequence + event.key.toUpperCase();
      setKeySequence(newSequence);
      
      // Check if the sequence ends with "CDERF"
      if (newSequence.endsWith('CDERF')) {
        navigate('/dashboard');
        setKeySequence(''); // Reset sequence
      }
      
      // Reset sequence if it gets too long or doesn't match
      if (newSequence.length > 10) {
        setKeySequence('');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [keySequence, navigate]);

  // Filter tours based on search term and selected category - optimized with useMemo
  const filteredTours = useMemo(() => {
    return tours.filter(tour => {
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
  }, [tours, selectedCategory, searchTerm]);

  const handleReserveNow = useCallback((tourId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    navigate(`/reservar/${tourId}`);
  }, [navigate]);

  const handleTourClick = useCallback(async (tourId: string) => {
    const tour = tours.find(t => t.id === tourId);
    if (tour) {
      setSelectedTour(tour);
      setModalOpen(true);
      
      // Cargar imágenes específicas del tour si no están en caché
      if (!tourImages[tourId] || tourImages[tourId].length === 0) {
        try {
          const { data: tourImagesData, error } = await supabase
            .from('tour_images')
            .select('*')
            .eq('tour_id', tourId)
            .order('order_index', { ascending: true })
            .limit(10);

          if (!error && tourImagesData && tourImagesData.length > 0) {
            setTourImages(prev => ({
              ...prev,
              [tourId]: tourImagesData
            }));
          }
        } catch (error) {
          console.warn('Error loading tour images on demand:', error);
        }
      }
    }
  }, [tours, tourImages]);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedTour(null);
  }, []);

  const handleReserveFromModal = useCallback((tourId: string) => {
    setModalOpen(false);
    setSelectedTour(null);
    navigate(`/reservar/${tourId}`);
  }, [navigate]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

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
    const message = encodeURIComponent('🌴 *CONSULTA GENERAL - Jon Tour Punta Cana* 🌴\n\n¡Hola! Me interesa información sobre sus tours en Punta Cana. ¿Podrías ayudarme a encontrar la experiencia perfecta para mi viaje? 🎉');
    
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
    const email = 'jontourpuntacana@gmail.com';
    const subject = encodeURIComponent('Consulta sobre Tours en Punta Cana');
    const body = encodeURIComponent('Hola,\n\nMe interesa obtener más información sobre sus tours en Punta Cana.\n\nGracias');
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            Cargando tours...
          </p>
          <p className="text-gray-500 text-sm mt-2">Optimizando para mejor rendimiento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  JON TOUR PUNTA CANA
                </h1>
                <p className="text-xs text-gray-600 hidden sm:block">{t.authenticExperiences}</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              <a href="#tours" className="text-gray-700 hover:text-blue-600 transition-colors">Tours</a>
              <button 
                onClick={() => {
                  const element = document.getElementById('transportation');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Transporte
              </button>
              <a href="/nosotros" className="text-gray-700 hover:text-blue-600 transition-colors">Nosotros</a>
              <a href="/contacto" className="text-gray-700 hover:text-blue-600 transition-colors">Contacto</a>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-700" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-3">
              <nav className="flex flex-col space-y-3">
                <a 
                  href="#tours" 
                  className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tours
                </a>
                <button 
                  onClick={() => {
                    const element = document.getElementById('transportation');
                    element?.scrollIntoView({ behavior: 'smooth' });
                    setMobileMenuOpen(false);
                  }}
                  className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-2 text-left w-full"
                >
                  Transporte
                </button>
                <a 
                  href="/nosotros" 
                  className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Nosotros
                </a>
                <a 
                  href="/contacto" 
                  className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contacto
                </a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[400px] md:h-[600px] flex items-center justify-center overflow-hidden">
        {/* Hero Background Image - Always visible */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroBackgroundImage})`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-emerald-900/30"></div>
        </div>
        
        {/* No loading indicators needed - static image loads instantly */}
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 animate-fade-in hero-title-shadow leading-tight">
            {t.heroTitle}
          </h2>
          <p className="text-base sm:text-lg md:text-2xl mb-4 md:mb-8 animate-fade-in opacity-90 px-2">
            {t.heroSubtitle.split('•').map((part, index, array) => (
              <span key={index}>
                {part.trim()}
                {index < array.length - 1 && (
                  <span className="text-yellow-300 mx-1 md:mx-2 font-bold text-lg md:text-2xl drop-shadow-lg">•</span>
                )}
              </span>
            ))}
          </p>
          
          <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3 justify-center items-center mb-4 w-full max-w-sm mx-auto">
            <div className="relative w-full">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input 
                placeholder={t.searchPlaceholder} 
                className="pl-10 h-11 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/70 text-sm"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <Button 
              type="submit"
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 h-11 px-6 w-full text-sm"
            >
              {t.exploreButton}
            </Button>
          </form>

          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
              <Star className="w-3 h-3 text-yellow-400" />
              <span>{t.reviews}</span>
            </div>
            <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
              <Users className="w-3 h-3" />
              <span>{t.smallGroups}</span>
            </div>
            <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
              <MapPin className="w-3 h-3" />
              <span>{t.localGuides}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tours Section */}
      <section id="tours" className="py-6 md:py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-6 md:mb-12">
          <h3 className="text-xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
            {t.featuredTours}
          </h3>
          <p className="text-sm md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            {t.featuredSubtitle}
          </p>
        </div>

        {/* Search Results Info */}
        {searchTerm && (
          <div className="mb-6 text-center">
            <p className="text-gray-600">
              {filteredTours.length > 0 
                ? `${filteredTours.length} ${t.toursFound} "${searchTerm}"`
                : `${t.noToursFound} "${searchTerm}"`
              }
            </p>
            {searchTerm && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchTerm('')}
                className="mt-2"
              >
                {t.clearSearch}
              </Button>
            )}
          </div>
        )}

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-4 md:mb-10 px-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`rounded-full text-xs md:text-base h-8 md:h-10 ${
                selectedCategory === category.id 
                  ? 'bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700' 
                  : 'hover:bg-blue-50'
              }`}
            >
              {category.name}
              <Badge variant="secondary" className="ml-1 text-xs">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Tours Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">{t.loadingTours}</p>
          </div>
        ) : filteredTours.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">
              {searchTerm ? t.noToursSearch : t.noToursCategory}
            </p>
            {(searchTerm || selectedCategory !== 'todos') && (
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('todos');
                }}
                className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
              >
                {t.viewAllTours}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 lg:gap-8">
            {filteredTours.map((tour) => (
              <TourCard
                key={tour.id}
                tour={tour}
                onTourClick={handleTourClick}
                onReserveClick={handleReserveNow}
                reserveText={t.reserveNow}
              />
            ))}
          </div>
        )}
      </section>

        {/* Transportation Section */}
        <section id="transportation">
          <TransportationSection />
        </section>

        {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-emerald-600 py-6 md:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h3 className="text-xl md:text-4xl font-bold mb-2 md:mb-4">
            {t.readyForAdventure}
          </h3>
          <p className="text-sm md:text-xl mb-4 md:mb-8 opacity-90 px-2">
            {t.contactExperts}
          </p>
          <div className="flex flex-col gap-3 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 text-sm h-11"
              onClick={handleWhatsAppClick}
            >
              <WhatsAppIcon className="w-4 h-4 mr-2" />
              WhatsApp +1 (809) 840-8257
            </Button>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 text-sm h-11"
              onClick={handleEmailClick}
            >
              Email: jontourpuntacana@gmail.com
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 md:py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Jon Tour Punta Cana</span>
            </div>
            <p className="text-gray-400">
              {currentLanguage === 'es' ? 'Tu compañía de confianza para explorar lo mejor de República Dominicana.' :
               currentLanguage === 'en' ? 'Your trusted company to explore the best of the Dominican Republic.' :
               'Votre entreprise de confiance pour explorer le meilleur de la République dominicaine.'}
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">
              {t.popularTours}
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li>{t.saonaIsland}</li>
              <li>{t.safariAdventure}</li>
              <li>{t.blueHole}</li>
              <li>{t.santoDomingo}</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">
              {t.services}
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li>{t.privateTours}</li>
              <li>{t.corporateGroups}</li>
              <li>{t.transportation}</li>
              <li>{t.certifiedGuides}</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">
              {t.contact}
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li>📱 +1 (809) 840-8257</li>
              <li>✉️ jontourpuntacana@gmail.com</li>
              <li>🕒 {t.hours}</li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>{t.copyright}</p>
        </div>
      </footer>

      {/* Tour Detail Modal */}
      <TourDetailModal
        tour={selectedTour}
        tourImages={selectedTour ? (tourImages[selectedTour.id] || []) : []}
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onReserve={handleReserveFromModal}
        reserveText={t.reserveNow}
      />
    </div>
  );
};

export default Index;