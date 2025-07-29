import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, Mail, Phone, MessageSquare, Check, X, Eye, EyeOff, Plus, Edit, Trash2, Home, Upload, Settings, Image as ImageIcon } from 'lucide-react';
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
  created_at: string;
}

interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  created_at: string;
  updated_at: string;
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
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'reservations' | 'messages' | 'posts' | 'settings'>('reservations');
  const [showAddPost, setShowAddPost] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [backgroundImage, setBackgroundImage] = useState('');
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
      // Fetch reservations with tour details
      const { data: reservationsData, error: reservationsError } = await supabase
        .from('reservations')
        .select(`
          *,
          posts (
            title,
            price
          )
        `)
        .order('created_at', { ascending: false });

      if (reservationsError) throw reservationsError;
      setReservations(reservationsData || []);

      // Fetch contact messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;
      setContactMessages(messagesData || []);

      // Fetch posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;
      setPosts(postsData || []);

      // Fetch site settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('site_settings')
        .select('*')
        .order('created_at', { ascending: false });

      if (settingsError) throw settingsError;
      setSiteSettings(settingsData || []);
      
      // Set current background image
      const bgSetting = settingsData?.find(s => s.setting_key === 'hero_background_image');
      if (bgSetting) {
        setBackgroundImage(bgSetting.setting_value);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSiteSetting = async (key: string, value: string) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          setting_key: key,
          setting_value: value,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'setting_key'
        });

      if (error) throw error;

      toast({
        title: "Configuración actualizada",
        description: "Los cambios se han guardado exitosamente",
      });

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
      toast({
        title: "Error",
        description: "No se pudo actualizar la configuración",
        variant: "destructive",
      });
    }
  };

  const handleBackgroundImageChange = (imageUrl: string) => {
    setBackgroundImage(imageUrl);
    updateSiteSetting('hero_background_image', imageUrl);
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
    const message = `🎉 *RESERVA CONFIRMADA - Jon Tours and Adventure* 🎉

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

*Jon Tours and Adventure*
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

  const handleAddPost = async () => {
    try {
      const { error } = await supabase
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
          highlights: newPost.highlights.filter(h => h.trim() !== '')
        }]);

      if (error) throw error;

      toast({
        title: "Tour agregado",
        description: "El tour se ha agregado exitosamente",
      });

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
      const { error } = await supabase
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

      if (error) throw error;

      toast({
        title: "Tour actualizado",
        description: "El tour se ha actualizado exitosamente",
      });

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
              Jon Tours Dashboard
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Dashboard - Jon Tours
            </h1>
            <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
              <Button
                variant={activeTab === 'reservations' ? 'default' : 'outline'}
                onClick={() => setActiveTab('reservations')}
                className="text-sm"
              >
                Reservas ({reservations.length})
              </Button>
              <Button
                variant={activeTab === 'messages' ? 'default' : 'outline'}
                onClick={() => setActiveTab('messages')}
                className="text-sm"
              >
                Mensajes ({contactMessages.length})
              </Button>
              <Button
                variant={activeTab === 'posts' ? 'default' : 'outline'}
                onClick={() => setActiveTab('posts')}
                className="text-sm"
              >
                Tours ({posts.length})
              </Button>
              <Button
                variant={activeTab === 'settings' ? 'default' : 'outline'}
                onClick={() => setActiveTab('settings')}
                className="text-sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configuración
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="text-sm flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Inicio
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAuthenticated(false);
                  setPassword('');
                }}
                className="text-sm"
              >
                Cerrar Sesión
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
                        <CardDescription className="text-sm">
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
                        <span>{reservation.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-600" />
                        <span>{reservation.guests} huéspedes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-purple-600" />
                        <span className="truncate">{reservation.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-orange-600" />
                        <span>{reservation.phone}</span>
                      </div>
                    </div>
                    
                    {reservation.special_requests && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 text-gray-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-sm text-gray-700">Solicitudes especiales:</div>
                            <div className="text-sm text-gray-600 mt-1">{reservation.special_requests}</div>
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
                    
                    {message.status !== 'read' && (
                      <Button
                        onClick={() => updateMessageStatus(message.id, 'read')}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Marcar como leído
                      </Button>
                    )}
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
                      <Label htmlFor="image_url">URL de la imagen</Label>
                      <Input
                        id="image_url"
                        value={newPost.image_url}
                        onChange={(e) => setNewPost({ ...newPost, image_url: e.target.value })}
                        placeholder="https://ejemplo.com/imagen.jpg"
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
                                <Label htmlFor="edit-image">URL de la imagen</Label>
                                <Input
                                  id="edit-image"
                                  value={editingPost.image_url}
                                  onChange={(e) => setEditingPost({ ...editingPost, image_url: e.target.value })}
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
      </div>
    </div>
  );
};

export default Dashboard;