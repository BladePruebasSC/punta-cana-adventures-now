
import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, Mail, Phone, MessageSquare, Check, X, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'reservations' | 'messages'>('reservations');
  const { toast } = useToast();

  // Simple password authentication
  const ADMIN_PASSWORD = 'jon2024admin';

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
            <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
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
        {activeTab === 'reservations' ? (
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
        ) : (
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
      </div>
    </div>
  );
};

export default Dashboard;
