import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, Mail, Phone, MessageSquare, Check, X, Eye, EyeOff, Plus, Edit, Trash2, Home, Upload, Settings, Image as ImageIcon, MessageCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ImageUpload from '@/components/ImageUpload';
import { supabase } from '@/integrations/supabase/client';
import { toursCache, tourImagesCache, siteSettingsCache, reservationsCache, messagesCache, CACHE_KEYS, CACHE_TTL, invalidateCache } from '@/lib/cache';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Reservation {
  id: string;
  tour_id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  guests: number;
  special_requests: string | null;
  status: string;
  created_at: string;
  posts: {
    title: string;
    price: number;
  } | null;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string | null;
  created_at: string;
}

interface Post {
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
  display_order: number;
  created_at: string;
}

interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  created_at: string;
  updated_at: string;
}

interface TourImage {
  id: string;
  tour_id: string;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  order_index: number;
  created_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSetting[]>([]);
  const [tourImages, setTourImages] = useState<Record<string, TourImage[]>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'reservations' | 'messages' | 'posts' | 'settings' | 'nosotros'>('reservations');
  const [showAddPost, setShowAddPost] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [showImageManager, setShowImageManager] = useState(false);
  const [selectedTourForImages, setSelectedTourForImages] = useState<Post | null>(null);
  const [showAddImageDialog, setShowAddImageDialog] = useState(false);
  const [newImageData, setNewImageData] = useState({
    imageUrl: '',
    altText: ''
  });
  const [nosotrosImages, setNosotrosImages] = useState<{
    hero: string;
    inicios: string;
    experiencia: string;
  }>({
    hero: '',
    inicios: '',
    experiencia: ''
  });
  const [showNosotrosImageManager, setShowNosotrosImageManager] = useState(false);
  const { toast } = useToast();

  // Changed password to jontours2025
  const ADMIN_PASSWORD = 'jontours2025';

  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    image_url: '',
    price: 0,
    duration: '',
    rating: 5,
    category: 'aventura',
    group_size: '',
    highlights: ['']
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast({
        title: "Bienvenido",
        description: "Acceso autorizado al dashboard",
      });
    } else {
      toast({
        title: "Error",
        description: "Contraseña incorrecta",
        variant: "destructive",
      });
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('📡 Loading dashboard data...');

      // Verificar caché primero
      const cachedReservations = reservationsCache.get<Reservation[]>(CACHE_KEYS.RESERVATIONS);
      const cachedMessages = messagesCache.get<ContactMessage[]>(CACHE_KEYS.MESSAGES);
      const cachedPosts = toursCache.get<Post[]>(CACHE_KEYS.TOURS);
      const cachedImages = tourImagesCache.get<Record<string, TourImage[]>>(CACHE_KEYS.TOUR_IMAGES);
      const cachedSettings = siteSettingsCache.get<SiteSetting[]>(CACHE_KEYS.SITE_SETTINGS);

      if (cachedReservations && cachedMessages && cachedPosts && cachedImages && cachedSettings) {
        console.log('🚀 Using cached dashboard data - Instant load!');
        setReservations(cachedReservations);
        setContactMessages(cachedMessages);
        setPosts(cachedPosts);
        setTourImages(cachedImages);
        setSiteSettings(cachedSettings);
        
              // Set current background image
      const bgSetting = cachedSettings.find(s => s.setting_key === 'hero_background_image');
      if (bgSetting) {
        setBackgroundImage(bgSetting.setting_value);
      }

      // Set current nosotros images
      const nosotrosHeroSetting = cachedSettings.find(s => s.setting_key === 'nosotros_hero_image');
      const nosotrosIniciosSetting = cachedSettings.find(s => s.setting_key === 'nosotros_inicios_image');
      const nosotrosExperienciaSetting = cachedSettings.find(s => s.setting_key === 'nosotros_experiencia_image');
      
      setNosotrosImages({
        hero: nosotrosHeroSetting?.setting_value || '',
        inicios: nosotrosIniciosSetting?.setting_value || '',
        experiencia: nosotrosExperienciaSetting?.setting_value || ''
      });
        
        setLoading(false);
        return;
      }

      // Cargar datos esenciales primero (reservations y messages)
      console.log('📡 Loading essential data (reservations, messages)...');
      
      const [reservationsResponse, messagesResponse] = await Promise.all([
        supabase
          .from('reservations')
          .select(`
            *,
            posts (
              title,
              price
            )
          `)
          .order('created_at', { ascending: false }),
        supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false })
      ]);

      const { data: reservationsData, error: reservationsError } = reservationsResponse;
      const { data: messagesData, error: messagesError } = messagesResponse;

      if (reservationsError) throw reservationsError;
      if (messagesError) throw messagesError;

      // Mostrar datos esenciales inmediatamente
      setReservations(reservationsData || []);
      setContactMessages(messagesData || []);
      console.log('✅ Essential data loaded, showing dashboard...');
      setLoading(false);

      // Guardar en caché inmediatamente
      reservationsCache.set(CACHE_KEYS.RESERVATIONS, reservationsData || [], CACHE_TTL.RESERVATIONS);
      messagesCache.set(CACHE_KEYS.MESSAGES, messagesData || [], CACHE_TTL.MESSAGES);

      // Cargar datos adicionales en segundo plano
      setTimeout(async () => {
        try {
          console.log('📡 Loading additional data (posts, images, settings)...');
          
          const [postsResponse, settingsResponse] = await Promise.all([
            supabase.from('posts').select('*').order('display_order', { ascending: true }).order('created_at', { ascending: false }),
            supabase.from('site_settings').select('*').order('created_at', { ascending: false })
          ]);

          const { data: postsData, error: postsError } = postsResponse;
          const { data: settingsData, error: settingsError } = settingsResponse;

          if (postsError) throw postsError;
          if (settingsError) throw settingsError;

          // Actualizar posts y settings primero
          setPosts(postsData || []);
          setSiteSettings(settingsData || []);

          // Guardar en caché
          toursCache.set(CACHE_KEYS.TOURS, postsData || [], CACHE_TTL.TOURS);
          siteSettingsCache.set(CACHE_KEYS.SITE_SETTINGS, settingsData || [], CACHE_TTL.SITE_SETTINGS);

          // Cargar imágenes DESPUÉS de cargar posts
          if (postsData && postsData.length > 0) {
            try {
              const tourIds = postsData.map(post => post.id);
              
              const { data: imagesData, error: imagesError } = await supabase
                .from('tour_images')
                .select('*')
                .in('tour_id', tourIds)
                .order('order_index', { ascending: true });

              if (!imagesError && imagesData) {
                // Group images by tour_id
                const imagesByTour: Record<string, TourImage[]> = {};
                imagesData.forEach(image => {
                  if (!imagesByTour[image.tour_id]) {
                    imagesByTour[image.tour_id] = [];
                  }
                  imagesByTour[image.tour_id].push(image);
                });
                
                console.log('✅ Tour images loaded:', imagesByTour);
                setTourImages(imagesByTour);
                tourImagesCache.set(CACHE_KEYS.TOUR_IMAGES, imagesByTour, CACHE_TTL.TOUR_IMAGES);
              }
            } catch (imageError) {
              console.warn('Tour images loading failed (non-critical):', imageError);
              setTourImages({});
            }
          }

          // Set current background image
          const bgSetting = settingsData?.find(s => s.setting_key === 'hero_background_image');
          if (bgSetting) {
            setBackgroundImage(bgSetting.setting_value);
          }

          // Set current nosotros images
          const nosotrosHeroSetting = settingsData?.find(s => s.setting_key === 'nosotros_hero_image');
          const nosotrosIniciosSetting = settingsData?.find(s => s.setting_key === 'nosotros_inicios_image');
          const nosotrosExperienciaSetting = settingsData?.find(s => s.setting_key === 'nosotros_experiencia_image');
          
          setNosotrosImages({
            hero: nosotrosHeroSetting?.setting_value || '',
            inicios: nosotrosIniciosSetting?.setting_value || '',
            experiencia: nosotrosExperienciaSetting?.setting_value || ''
          });

          console.log('✅ Additional data loaded and cached');
        } catch (error) {
          console.error('Error loading additional data:', error);
        }
      }, 100);

    } catch (error) {
      console.error('Error fetching essential data:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const updateSiteSetting = async (key: string, value: string) => {
    try {
      console.log(`Actualizando configuración: ${key}`);
      console.log(`Valor a guardar (longitud: ${value.length}):`, value.substring(0, 100) + '...');
      
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          setting_key: key,
          setting_value: value,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'setting_key'
        });

      if (error) {
        console.error('Error de Supabase:', error);
        throw error;
      }

      console.log('Configuración actualizada exitosamente en la base de datos');

      toast({
        title: "Configuración actualizada",
        description: "Los cambios se han guardado exitosamente",
      });

      // Invalidar caché de configuraciones del sitio
      invalidateCache.siteSettings();

      // Update local state
      setSiteSettings(prev => {
        const existing = prev.find(s => s.setting_key === key);
        if (existing) {
          return prev.map(s => 
            s.setting_key === key 
              ? { ...s, setting_value: value, updated_at: new Date().toISOString() }
              : s
          );
        } else {
          return [...prev, {
            id: crypto.randomUUID(),
            setting_key: key,
            setting_value: value,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }];
        }
      });

    } catch (error) {
      console.error('Error updating site setting:', error);
      
      // Proporcionar información más específica del error
      let errorMessage = "No se pudo actualizar la configuración";
      
      if (error instanceof Error) {
        if (error.message.includes('base64')) {
          errorMessage = "La imagen es demasiado grande. Intenta con una imagen más pequeña.";
        } else if (error.message.includes('storage')) {
          errorMessage = "Error de almacenamiento. Intenta nuevamente.";
        } else if (error.message.includes('network')) {
          errorMessage = "Error de conexión. Verifica tu internet.";
        } else if (error.message.includes('permission') || error.message.includes('policy')) {
          errorMessage = "Error de permisos. Contacta al administrador.";
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleBackgroundImageChange = (imageUrl: string) => {
    setBackgroundImage(imageUrl);
    updateSiteSetting('hero_background_image', imageUrl);
  };

  const handleNosotrosImageChange = (imageType: 'hero' | 'inicios' | 'experiencia', imageUrl: string) => {
    setNosotrosImages(prev => ({ ...prev, [imageType]: imageUrl }));
    updateSiteSetting(`nosotros_${imageType}_image`, imageUrl);
  };

  const updateReservationStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setReservations(prev => prev.map(reservation => 
        reservation.id === id ? { ...reservation, status } : reservation
      ));

      toast({
        title: "Estado actualizado",
        description: `Reserva ${status === 'confirmed' ? 'confirmada' : 'rechazada'} exitosamente`,
      });

      // If confirming, send WhatsApp message to customer
      if (status === 'confirmed') {
        const reservation = reservations.find(r => r.id === id);
        if (reservation) {
          sendConfirmationWhatsApp(reservation);
        }
      }

    } catch (error) {
      console.error('Error updating reservation:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la reserva",
        variant: "destructive",
      });
    }
  };

  const sendConfirmationWhatsApp = (reservation: Reservation) => {
    const message = `🎉 *RESERVA CONFIRMADA - Jon Tours Punta Cana* 🎉

¡Hola ${reservation.name}! ✨

Tu reserva ha sido confirmada exitosamente:

📋 *Detalles de tu Tour:*
• Tour: ${reservation.posts?.title || 'Tour no disponible'}
• Fecha: ${reservation.date}
• Huéspedes: ${reservation.guests}
• Total: $${reservation.posts ? (reservation.posts.price * reservation.guests).toFixed(2) : '0.00'}

📍 *Próximos pasos:*
• Te contactaremos 24h antes con el punto de encuentro
• Recuerda traer documento de identidad
• Usa ropa cómoda y protector solar

${reservation.special_requests ? `📝 *Hemos anotado:*\n${reservation.special_requests}\n\n` : ''}¡Estamos emocionados de tenerte en esta aventura! 🌴

*Jon Tours Punta Cana*
+1 (809) 840-8257`;

    const phoneNumber = reservation.phone.replace(/[^\d]/g, '');
    const encodedMessage = encodeURIComponent(message);
    
    // iOS-friendly WhatsApp redirect
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
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
  };

  const updateMessageStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setContactMessages(prev => prev.map(message => 
        message.id === id ? { ...message, status } : message
      ));

      toast({
        title: "Estado actualizado",
        description: `Mensaje marcado como ${status === 'read' ? 'leído' : 'pendiente'}`,
      });

    } catch (error) {
      console.error('Error updating message:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del mensaje",
        variant: "destructive",
      });
    }
  };

  const openWhatsAppWithClient = (message: ContactMessage) => {
    if (!message.phone) {
      toast({
        title: "Sin número de teléfono",
        description: "Este cliente no proporcionó un número de teléfono",
        variant: "destructive",
      });
      return;
    }

    const phoneNumber = message.phone.replace(/[^\d]/g, '');
    const messageText = `Hola ${message.name}, 

Gracias por contactarnos a través de nuestro sitio web. 

Sobre tu consulta: "${message.subject}"

${message.message}

¿En qué podemos ayudarte? 

Saludos,
Jon Tours Punta Cana
+1 (809) 840-8257`;

    const encodedMessage = encodeURIComponent(messageText);
    
    // iOS-friendly WhatsApp redirect
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
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
  };

  const handleAddPost = async () => {
    try {
      // Obtener el siguiente display_order
      const maxOrder = posts.length > 0 ? Math.max(...posts.map(p => p.display_order || 0)) : 0;
      const nextOrder = maxOrder + 1;

      // Insertar el tour en posts
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .insert([{
          title: newPost.title,
          description: newPost.description,
          image_url: newPost.image_url,
          price: newPost.price,
          duration: newPost.duration,
          rating: newPost.rating,
          category: newPost.category,
          group_size: newPost.group_size,
          highlights: newPost.highlights.filter(h => h.trim() !== ''),
          display_order: nextOrder
        }])
        .select()
        .single();

      if (postError) throw postError;

      // Si hay una imagen, insertarla en tour_images como imagen principal
      if (newPost.image_url && postData) {
        const { error: imageError } = await supabase
          .from('tour_images')
          .insert([{
            tour_id: postData.id,
            image_url: newPost.image_url,
            alt_text: newPost.title,
            is_primary: true,
            order_index: 0
          }]);

        if (imageError) {
          console.error('Error inserting tour image:', imageError);
          // No lanzar error aquí para no revertir la inserción del tour
        }
      }

      toast({
        title: "Tour agregado",
        description: "El tour se ha agregado exitosamente",
      });

      // Invalidar caché de tours
      invalidateCache.tours();

      setShowAddPost(false);
      setNewPost({
        title: '',
        description: '',
        image_url: '',
        price: 0,
        duration: '',
        rating: 5,
        category: 'aventura',
        group_size: '',
        highlights: ['']
      });
      fetchData();

    } catch (error) {
      console.error('Error adding post:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar el tour",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePost = async () => {
    if (!editingPost) return;

    try {
      // Actualizar el tour en posts
      const { error: postError } = await supabase
        .from('posts')
        .update({
          title: editingPost.title,
          description: editingPost.description,
          image_url: editingPost.image_url,
          price: editingPost.price,
          duration: editingPost.duration,
          rating: editingPost.rating,
          category: editingPost.category,
          group_size: editingPost.group_size,
          highlights: editingPost.highlights.filter(h => h.trim() !== '')
        })
        .eq('id', editingPost.id);

      if (postError) throw postError;

      // Actualizar la imagen principal en tour_images
      if (editingPost.image_url) {
        // Primero, verificar si ya existe una imagen principal para este tour
        const { data: existingImage } = await supabase
          .from('tour_images')
          .select('id')
          .eq('tour_id', editingPost.id)
          .eq('is_primary', true)
          .single();

        if (existingImage) {
          // Actualizar la imagen principal existente
          const { error: imageError } = await supabase
            .from('tour_images')
            .update({
              image_url: editingPost.image_url,
              alt_text: editingPost.title
            })
            .eq('id', existingImage.id);

          if (imageError) {
            console.error('Error updating tour image:', imageError);
          }
        } else {
          // Crear nueva imagen principal
          const { error: imageError } = await supabase
            .from('tour_images')
            .insert([{
              tour_id: editingPost.id,
              image_url: editingPost.image_url,
              alt_text: editingPost.title,
              is_primary: true,
              order_index: 0
            }]);

          if (imageError) {
            console.error('Error inserting tour image:', imageError);
          }
        }
      }

      toast({
        title: "Tour actualizado",
        description: "El tour se ha actualizado exitosamente",
      });

      // Invalidar caché de tours
      invalidateCache.tours();

      setEditingPost(null);
      fetchData();

    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el tour",
        variant: "destructive",
      });
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Tour eliminado",
        description: "El tour se ha eliminado exitosamente",
      });

      // Invalidar caché de tours
      invalidateCache.tours();

      fetchData();

    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el tour",
        variant: "destructive",
      });
    }
  };

  const moveTourUp = async (tourId: string, currentOrder: number) => {
    try {
      // Encontrar el tour anterior (con display_order menor)
      const tourAbove = posts
        .filter(p => p.display_order < currentOrder)
        .sort((a, b) => b.display_order - a.display_order)[0];

      if (!tourAbove) {
        toast({
          title: "Información",
          description: "Este tour ya está en la primera posición",
        });
        return;
      }

      // Intercambiar los display_order
      const { error: error1 } = await supabase
        .from('posts')
        .update({ display_order: tourAbove.display_order })
        .eq('id', tourId);

      const { error: error2 } = await supabase
        .from('posts')
        .update({ display_order: currentOrder })
        .eq('id', tourAbove.id);

      if (error1 || error2) throw error1 || error2;

      toast({
        title: "Orden actualizado",
        description: "El tour se ha movido hacia arriba",
      });

      // Invalidar caché y recargar
      invalidateCache.tours();
      fetchData();

    } catch (error) {
      console.error('Error moving tour up:', error);
      toast({
        title: "Error",
        description: "No se pudo cambiar el orden del tour",
        variant: "destructive",
      });
    }
  };

  const moveTourDown = async (tourId: string, currentOrder: number) => {
    try {
      // Encontrar el tour siguiente (con display_order mayor)
      const tourBelow = posts
        .filter(p => p.display_order > currentOrder)
        .sort((a, b) => a.display_order - b.display_order)[0];

      if (!tourBelow) {
        toast({
          title: "Información",
          description: "Este tour ya está en la última posición",
        });
        return;
      }

      // Intercambiar los display_order
      const { error: error1 } = await supabase
        .from('posts')
        .update({ display_order: tourBelow.display_order })
        .eq('id', tourId);

      const { error: error2 } = await supabase
        .from('posts')
        .update({ display_order: currentOrder })
        .eq('id', tourBelow.id);

      if (error1 || error2) throw error1 || error2;

      toast({
        title: "Orden actualizado",
        description: "El tour se ha movido hacia abajo",
      });

      // Invalidar caché y recargar
      invalidateCache.tours();
      fetchData();

    } catch (error) {
      console.error('Error moving tour down:', error);
      toast({
        title: "Error",
        description: "No se pudo cambiar el orden del tour",
        variant: "destructive",
      });
    }
  };

  const handleAddTourImage = async (tourId: string, imageUrl: string, altText: string) => {
    try {
      console.log('Starting to add tour image:', { tourId, imageUrl, altText });
      
      // Obtener el siguiente order_index
      const tourImagesList = tourImages[tourId] || [];
      const nextOrderIndex = tourImagesList.length;
      
      console.log('Next order index:', nextOrderIndex);

      const { data, error } = await supabase
        .from('tour_images')
        .insert([{
          tour_id: tourId,
          image_url: imageUrl,
          alt_text: altText,
          is_primary: false,
          order_index: nextOrderIndex
        }])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Image added successfully:', data);

      toast({
        title: "Imagen agregada",
        description: "La imagen adicional se ha agregado exitosamente",
      });

      // Invalidar caché de imágenes de tours
      invalidateCache.tourImages();

      // Refrescar los datos
      await fetchData();

    } catch (error) {
      console.error('Error adding tour image:', error);
      
      let errorMessage = "No se pudo agregar la imagen";
      
      if (error instanceof Error) {
        if (error.message.includes('duplicate key')) {
          errorMessage = "Esta imagen ya existe para este tour";
        } else if (error.message.includes('foreign key')) {
          errorMessage = "El tour seleccionado no existe";
        } else if (error.message.includes('network')) {
          errorMessage = "Error de conexión. Verifica tu conexión a internet";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error; // Re-lanzar el error para que se maneje en handleAddNewImage
    }
  };

  const handleDeleteTourImage = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from('tour_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      toast({
        title: "Imagen eliminada",
        description: "La imagen se ha eliminado exitosamente",
      });

      // Invalidar caché de imágenes de tours
      invalidateCache.tourImages();

      fetchData();

    } catch (error) {
      console.error('Error deleting tour image:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la imagen",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTourImageOrder = async (imageId: string, newOrderIndex: number) => {
    try {
      const { error } = await supabase
        .from('tour_images')
        .update({ order_index: newOrderIndex })
        .eq('id', imageId);

      if (error) throw error;

      // Invalidar caché de imágenes de tours
      invalidateCache.tourImages();

      fetchData();

    } catch (error) {
      console.error('Error updating image order:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el orden de la imagen",
        variant: "destructive",
      });
    }
  };

  const testImageUrl = async (url: string) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.startsWith('image/')) {
        throw new Error('La URL no apunta a una imagen válida');
      }
      
      return true;
    } catch (error) {
      console.error('Error testing image URL:', error);
      throw error;
    }
  };

  const handleAddNewImage = async () => {
    if (!selectedTourForImages) {
      toast({
        title: "Error",
        description: "No se ha seleccionado ningún tour",
        variant: "destructive",
      });
      return;
    }

    if (!newImageData.imageUrl.trim()) {
      toast({
        title: "Error",
        description: "Por favor selecciona una imagen",
        variant: "destructive",
      });
      return;
    }

    if (!newImageData.altText.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un texto alternativo para la imagen",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Adding new image:', {
        tourId: selectedTourForImages.id,
        imageUrl: newImageData.imageUrl,
        altText: newImageData.altText
      });

      await handleAddTourImage(selectedTourForImages.id, newImageData.imageUrl, newImageData.altText);
      
      // Limpiar el formulario y cerrar el diálogo
      setNewImageData({ imageUrl: '', altText: '' });
      setShowAddImageDialog(false);
      
      toast({
        title: "Éxito",
        description: "La imagen se ha agregado correctamente al tour",
      });
    } catch (error) {
      console.error('Error adding new image:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo agregar la imagen.",
        variant: "destructive",
      });
    }
  };

  const addHighlight = (isEditing = false) => {
    if (isEditing && editingPost) {
      setEditingPost({
        ...editingPost,
        highlights: [...editingPost.highlights, '']
      });
    } else {
      setNewPost({
        ...newPost,
        highlights: [...newPost.highlights, '']
      });
    }
  };

  const updateHighlight = (index: number, value: string, isEditing = false) => {
    if (isEditing && editingPost) {
      const newHighlights = [...editingPost.highlights];
      newHighlights[index] = value;
      setEditingPost({
        ...editingPost,
        highlights: newHighlights
      });
    } else {
      const newHighlights = [...newPost.highlights];
      newHighlights[index] = value;
      setNewPost({
        ...newPost,
        highlights: newHighlights
      });
    }
  };

  const removeHighlight = (index: number, isEditing = false) => {
    if (isEditing && editingPost) {
      setEditingPost({
        ...editingPost,
        highlights: editingPost.highlights.filter((_, i) => i !== index)
      });
    } else {
      setNewPost({
        ...newPost,
        highlights: newPost.highlights.filter((_, i) => i !== index)
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmada</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rechazada</Badge>;
      default:
        return <Badge variant="secondary">Pendiente</Badge>;
    }
  };

  const getMessageStatusBadge = (status: string | null) => {
    switch (status) {
      case 'read':
        return <Badge className="bg-green-500">Leído</Badge>;
      default:
        return <Badge variant="secondary">Nuevo</Badge>;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-emerald-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Jon Tours Punta Cana Dashboard
            </CardTitle>
            <CardDescription>
              Ingresa la contraseña para acceder
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
              >
                Ingresar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-emerald-50">
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col space-y-4">
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent text-center sm:text-left">
              Dashboard - Jon Tours Punta Cana
            </h1>
            
            {/* Navegación principal - Ultra optimizada para móvil */}
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <Button
                variant={activeTab === 'reservations' ? 'default' : 'outline'}
                onClick={() => setActiveTab('reservations')}
                className="text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
              >
                <span className="hidden sm:inline">Reservas</span>
                <span className="sm:hidden">Res.</span>
                <span className="ml-1">({reservations.length})</span>
              </Button>
              <Button
                variant={activeTab === 'messages' ? 'default' : 'outline'}
                onClick={() => setActiveTab('messages')}
                className="text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
              >
                <span className="hidden sm:inline">Mensajes</span>
                <span className="sm:hidden">Msg.</span>
                <span className="ml-1">({contactMessages.length})</span>
              </Button>
              <Button
                variant={activeTab === 'posts' ? 'default' : 'outline'}
                onClick={() => setActiveTab('posts')}
                className="text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
              >
                <span className="hidden sm:inline">Tours</span>
                <span className="sm:hidden">Tours</span>
                <span className="ml-1">({posts.length})</span>
              </Button>
              <Button
                variant={activeTab === 'settings' ? 'default' : 'outline'}
                onClick={() => setActiveTab('settings')}
                className="text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
              >
                <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden sm:inline">Configuración</span>
                <span className="sm:hidden">Config</span>
              </Button>
              <Button
                variant={activeTab === 'nosotros' ? 'default' : 'outline'}
                onClick={() => setActiveTab('nosotros')}
                className="text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
              >
                <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden sm:inline">Página Nosotros</span>
                <span className="sm:hidden">Nosotros</span>
              </Button>
            </div>
            
            {/* Botones de acción - Ultra optimizados para móvil */}
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
              >
                <Home className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Inicio
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  invalidateCache.all();
                  toast({
                    title: "Caché limpiado",
                    description: "Todos los datos se actualizarán en la próxima visita",
                  });
                }}
                className="text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
              >
                <span className="hidden sm:inline">Limpiar Caché</span>
                <span className="sm:hidden">Limpiar</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAuthenticated(false);
                  setPassword('');
                }}
                className="text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
              >
                <span className="hidden sm:inline">Cerrar Sesión</span>
                <span className="sm:hidden">Salir</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'reservations' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Reservas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">{reservations.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Confirmadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-green-600">
                    {reservations.filter(r => r.status === 'confirmed').length}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Pendientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-yellow-600">
                    {reservations.filter(r => r.status === 'pending').length}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Rechazadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-red-600">
                    {reservations.filter(r => r.status === 'rejected').length}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {reservations.map((reservation) => (
                <Card key={reservation.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg sm:text-xl">
                          {reservation.posts?.title || 'Tour no disponible'}
                        </CardTitle>
                        <CardDescription className="text-sm text-black font-bold">
                          Reserva de {reservation.name} • {new Date(reservation.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-2 sm:mt-0">
                        {getStatusBadge(reservation.status)}
                        <div className="text-lg sm:text-xl font-bold text-green-600">
                          ${reservation.posts ? (reservation.posts.price * reservation.guests).toFixed(2) : '0.00'}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="text-black font-semibold">{reservation.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-600" />
                        <span className="text-black font-semibold">{reservation.guests} huéspedes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-purple-600" />
                        <span className="truncate text-black font-semibold">{reservation.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-orange-600" />
                        <span className="text-black font-semibold">{reservation.phone}</span>
                      </div>
                    </div>
                    
                    {reservation.special_requests && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 text-gray-600 mt-0.5" />
                          <div>
                            <div className="font-bold text-sm text-black">Solicitudes especiales:</div>
                            <div className="text-sm text-black font-semibold mt-1">{reservation.special_requests}</div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {reservation.status === 'pending' && (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                          className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Confirmar Reserva
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => updateReservationStatus(reservation.id, 'rejected')}
                          className="flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Rechazar
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mensajes de Contacto</CardTitle>
                <CardDescription>
                  {contactMessages.length} mensajes recibidos
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="space-y-4">
              {contactMessages.map((message) => (
                <Card key={message.id}>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <CardTitle className="text-lg">{message.subject}</CardTitle>
                        <CardDescription>
                          De: {message.name} ({message.email}) • {new Date(message.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      {getMessageStatusBadge(message.status)}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {message.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-orange-600" />
                        <span>{message.phone}</span>
                      </div>
                    )}
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">{message.message}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {message.phone && (
                        <Button
                          onClick={() => openWhatsAppWithClient(message)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Responder por WhatsApp
                        </Button>
                      )}
                      
                      {message.status !== 'read' && (
                        <Button
                          onClick={() => updateMessageStatus(message.id, 'read')}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Marcar como leído
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Tours</h2>
              <Dialog open={showAddPost} onOpenChange={setShowAddPost}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 mt-4 sm:mt-0">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Tour
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Agregar Nuevo Tour</DialogTitle>
                    <DialogDescription>
                      Completa la información del nuevo tour
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Título</Label>
                        <Input
                          id="title"
                          value={newPost.title}
                          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                          placeholder="Nombre del tour"
                        />
                      </div>
                      <div>
                        <Label htmlFor="price">Precio ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={newPost.price}
                          onChange={(e) => setNewPost({ ...newPost, price: Number(e.target.value) })}
                          placeholder="0"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        value={newPost.description}
                        onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                        placeholder="Descripción del tour"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="image_url">Imagen del tour</Label>
                      <ImageUpload
                        currentImageUrl={newPost.image_url}
                        onImageChange={(url) => setNewPost({ ...newPost, image_url: url })}
                        label=""
                        bucket="tour-images"
                        maxSizeMB={10}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="duration">Duración</Label>
                        <Input
                          id="duration"
                          value={newPost.duration}
                          onChange={(e) => setNewPost({ ...newPost, duration: e.target.value })}
                          placeholder="8 horas"
                        />
                      </div>
                      <div>
                        <Label htmlFor="group_size">Tamaño del grupo</Label>
                        <Input
                          id="group_size"
                          value={newPost.group_size}
                          onChange={(e) => setNewPost({ ...newPost, group_size: e.target.value })}
                          placeholder="Hasta 8 personas"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rating">Calificación</Label>
                        <Input
                          id="rating"
                          type="number"
                          min="1"
                          max="5"
                          step="0.1"
                          value={newPost.rating}
                          onChange={(e) => setNewPost({ ...newPost, rating: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Categoría</Label>
                      <Select
                        value={newPost.category}
                        onValueChange={(value) => setNewPost({ ...newPost, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aventura">Aventura</SelectItem>
                          <SelectItem value="playa">Playa & Mar</SelectItem>
                          <SelectItem value="cultura">Cultura</SelectItem>
                          <SelectItem value="naturaleza">Naturaleza</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Highlights</Label>
                      {newPost.highlights.map((highlight, index) => (
                        <div key={index} className="flex gap-2 mt-2">
                          <Input
                            value={highlight}
                            onChange={(e) => updateHighlight(index, e.target.value)}
                            placeholder={`Highlight ${index + 1}`}
                          />
                          {newPost.highlights.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeHighlight(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addHighlight()}
                        className="mt-2"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Highlight
                      </Button>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAddPost(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddPost}>
                      Agregar Tour
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="bg-white/90 text-gray-900 font-bold">
                        #{post.display_order || 0}
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-gradient-to-r from-blue-600 to-emerald-600">
                        ${post.price}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {post.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{post.group_size}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {post.highlights.slice(0, 2).map((highlight, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                      {post.highlights.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{post.highlights.length - 2} más
                        </Badge>
                      )}
                    </div>
                    
                    {/* Botones de ordenar */}
                    <div className="flex gap-2 pb-2 border-b">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveTourUp(post.id, post.display_order || 0)}
                        className="flex-1"
                        title="Mover hacia arriba"
                      >
                        <ArrowUp className="w-4 h-4 mr-1" />
                        Subir
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveTourDown(post.id, post.display_order || 0)}
                        className="flex-1"
                        title="Mover hacia abajo"
                      >
                        <ArrowDown className="w-4 h-4 mr-1" />
                        Bajar
                      </Button>
                    </div>
                    
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => setEditingPost(post)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Editar Tour</DialogTitle>
                          </DialogHeader>
                          
                          {editingPost && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="edit-title">Título</Label>
                                  <Input
                                    id="edit-title"
                                    value={editingPost.title}
                                    onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-price">Precio ($)</Label>
                                  <Input
                                    id="edit-price"
                                    type="number"
                                    value={editingPost.price}
                                    onChange={(e) => setEditingPost({ ...editingPost, price: Number(e.target.value) })}
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <Label htmlFor="edit-description">Descripción</Label>
                                <Textarea
                                  id="edit-description"
                                  value={editingPost.description}
                                  onChange={(e) => setEditingPost({ ...editingPost, description: e.target.value })}
                                  rows={3}
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="edit-image">Imagen del tour</Label>
                                <ImageUpload
                                  currentImageUrl={editingPost.image_url}
                                  onImageChange={(url) => setEditingPost({ ...editingPost, image_url: url })}
                                  label=""
                                  bucket="tour-images"
                                  maxSizeMB={10}
                                />
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <Label htmlFor="edit-duration">Duración</Label>
                                  <Input
                                    id="edit-duration"
                                    value={editingPost.duration}
                                    onChange={(e) => setEditingPost({ ...editingPost, duration: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-group">Tamaño del grupo</Label>
                                  <Input
                                    id="edit-group"
                                    value={editingPost.group_size}
                                    onChange={(e) => setEditingPost({ ...editingPost, group_size: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-rating">Calificación</Label>
                                  <Input
                                    id="edit-rating"
                                    type="number"
                                    min="1"
                                    max="5"
                                    step="0.1"
                                    value={editingPost.rating}
                                    onChange={(e) => setEditingPost({ ...editingPost, rating: Number(e.target.value) })}
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <Label htmlFor="edit-category">Categoría</Label>
                                <Select
                                  value={editingPost.category}
                                  onValueChange={(value) => setEditingPost({ ...editingPost, category: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="aventura">Aventura</SelectItem>
                                    <SelectItem value="playa">Playa & Mar</SelectItem>
                                    <SelectItem value="cultura">Cultura</SelectItem>
                                    <SelectItem value="naturaleza">Naturaleza</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label>Highlights</Label>
                                {editingPost.highlights.map((highlight, index) => (
                                  <div key={index} className="flex gap-2 mt-2">
                                    <Input
                                      value={highlight}
                                      onChange={(e) => updateHighlight(index, e.target.value, true)}
                                    />
                                    {editingPost.highlights.length > 1 && (
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeHighlight(index, true)}
                                      >
                                        <X className="w-4 h-4" />
                                      </Button>
                                    )}
                                  </div>
                                ))}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addHighlight(true)}
                                  className="mt-2"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Agregar Highlight
                                </Button>
                              </div>
                            </div>
                          )}
                          
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setEditingPost(null)}>
                              Cancelar
                            </Button>
                            <Button onClick={handleUpdatePost}>
                              Actualizar
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedTourForImages(post);
                          setShowImageManager(true);
                        }}
                        className="flex items-center gap-1"
                      >
                        <ImageIcon className="w-4 h-4" />
                        Imágenes
                      </Button>
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Diálogo para gestionar imágenes adicionales */}
        <Dialog open={showImageManager} onOpenChange={setShowImageManager}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Gestionar Imágenes del Tour</DialogTitle>
              <DialogDescription>
                {selectedTourForImages?.title}
              </DialogDescription>
            </DialogHeader>
            
            {selectedTourForImages && (
              <div className="space-y-6">
                {/* Imagen principal */}
                <div>
                  <Label className="text-lg font-semibold">Imagen Principal</Label>
                  <div className="mt-2 p-4 border rounded-lg">
                    <img
                      src={selectedTourForImages.image_url}
                      alt={selectedTourForImages.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <p className="mt-2 text-sm text-gray-600">
                      Esta imagen se actualiza desde la edición del tour
                    </p>
                  </div>
                </div>

                {/* Imágenes adicionales */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-lg font-semibold">Imágenes Adicionales</Label>
                    <Button
                      size="sm"
                      onClick={() => {
                        setShowAddImageDialog(true);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Imagen
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(tourImages[selectedTourForImages.id] || [])
                      .filter(img => !img.is_primary)
                      .sort((a, b) => a.order_index - b.order_index)
                      .map((image) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.image_url}
                            alt={image.alt_text}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteTourImage(image.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="mt-2 text-sm text-gray-600 truncate">{image.alt_text}</p>
                        </div>
                      ))}
                  </div>
                  
                  {(tourImages[selectedTourForImages.id] || []).filter(img => !img.is_primary).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No hay imágenes adicionales para este tour</p>
                      <p className="text-sm">Haz clic en "Agregar Imagen" para comenzar</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowImageManager(false)}>
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo para agregar nueva imagen adicional */}
        <Dialog open={showAddImageDialog} onOpenChange={setShowAddImageDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Nueva Imagen</DialogTitle>
              <DialogDescription>
                Agrega una imagen adicional para {selectedTourForImages?.title}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <ImageUpload
                currentImageUrl=""
                onImageChange={(imageUrl) => {
                  setNewImageData({ ...newImageData, imageUrl });
                }}
                label="Seleccionar Imagen"
                maxSizeMB={10}
              />
              
              <div>
                <Label htmlFor="new-alt-text">Texto Alternativo</Label>
                <Input
                  id="new-alt-text"
                  value={newImageData.altText}
                  onChange={(e) => setNewImageData({ ...newImageData, altText: e.target.value })}
                  placeholder="Descripción de la imagen"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddImageDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddNewImage}>
                Agregar Imagen
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configuración del Sitio
                </CardTitle>
                <CardDescription>
                  Personaliza la apariencia y configuración de tu sitio web
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Imagen de Fondo del Hero
                </CardTitle>
                <CardDescription>
                  Cambia la imagen de fondo de la sección principal de tu sitio web
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  currentImageUrl={backgroundImage}
                  onImageChange={handleBackgroundImageChange}
                  label="Imagen de Fondo"
                  maxSizeMB={10}
                />
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">💡 Consejos para la imagen de fondo:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Usa imágenes de alta resolución (mínimo 1920x1080px)</li>
                    <li>• Formatos recomendados: JPG, PNG, WebP</li>
                    <li>• Evita imágenes muy oscuras o con mucho detalle</li>
                    <li>• El texto blanco debe ser legible sobre la imagen</li>
                  </ul>
                </div>

                {backgroundImage && (
                  <div className="mt-4">
                    <Label className="text-sm font-medium">Vista previa en el sitio:</Label>
                    <div className="mt-2 relative h-32 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={backgroundImage}
                        alt="Vista previa del fondo"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-emerald-900/50 flex items-center justify-center">
                        <div className="text-white text-center">
                          <h3 className="text-lg font-bold">Descubre Todo Punta Cana</h3>
                          <p className="text-sm opacity-90">Vista previa del hero</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configuraciones Adicionales</CardTitle>
                <CardDescription>
                  Próximamente: más opciones de personalización
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Más opciones de configuración estarán disponibles pronto</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'nosotros' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Gestión de Imágenes - Página Nosotros
                </CardTitle>
                <CardDescription>
                  Gestiona las imágenes de la página "Nosotros" de tu sitio web
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Imagen Hero */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Imagen Hero</CardTitle>
                  <CardDescription>
                    Imagen principal de la sección hero de la página Nosotros
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ImageUpload
                    currentImageUrl={nosotrosImages.hero}
                    onImageChange={(imageUrl) => handleNosotrosImageChange('hero', imageUrl)}
                    label="Imagen Hero"
                    bucket="site-images"
                    maxSizeMB={10}
                  />
                  
                  {nosotrosImages.hero && (
                    <div className="mt-4">
                      <Label className="text-sm font-medium">Vista previa:</Label>
                      <div className="mt-2 relative h-32 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={nosotrosImages.hero}
                          alt="Vista previa Hero"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Imagen Inicios */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Imagen Inicios</CardTitle>
                  <CardDescription>
                    Imagen de la sección "Nuestros Inicios"
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ImageUpload
                    currentImageUrl={nosotrosImages.inicios}
                    onImageChange={(imageUrl) => handleNosotrosImageChange('inicios', imageUrl)}
                    label="Imagen Inicios"
                    bucket="site-images"
                    maxSizeMB={10}
                  />
                  
                  {nosotrosImages.inicios && (
                    <div className="mt-4">
                      <Label className="text-sm font-medium">Vista previa:</Label>
                      <div className="mt-2 relative h-32 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={nosotrosImages.inicios}
                          alt="Vista previa Inicios"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Imagen Experiencia */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Imagen Experiencia</CardTitle>
                  <CardDescription>
                    Imagen de la sección "Nuestra Experiencia"
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ImageUpload
                    currentImageUrl={nosotrosImages.experiencia}
                    onImageChange={(imageUrl) => handleNosotrosImageChange('experiencia', imageUrl)}
                    label="Imagen Experiencia"
                    bucket="site-images"
                    maxSizeMB={10}
                  />
                  
                  {nosotrosImages.experiencia && (
                    <div className="mt-4">
                      <Label className="text-sm font-medium">Vista previa:</Label>
                      <div className="mt-2 relative h-32 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={nosotrosImages.experiencia}
                          alt="Vista previa Experiencia"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Información de la Página Nosotros</CardTitle>
                <CardDescription>
                  Las imágenes se actualizarán automáticamente en la página "Nosotros"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">💡 Consejos para las imágenes:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>Imagen Hero:</strong> Usa una imagen panorámica de Punta Cana (1920x1080px)</li>
                    <li>• <strong>Imagen Inicios:</strong> Imagen que represente el inicio de la empresa</li>
                    <li>• <strong>Imagen Experiencia:</strong> Imagen que muestre la experiencia turística</li>
                    <li>• Formatos recomendados: JPG, PNG, WebP</li>
                    <li>• Tamaño máximo: 10MB por imagen</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;