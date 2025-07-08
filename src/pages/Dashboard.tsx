
import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Users, Mail, Phone, MessageSquare, Check, X, Search, Filter, Eye, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  guests: number;
  special_requests: string | null;
  status: string;
  created_at: string;
  tour_id: string;
  posts?: {
    title: string;
    price: number;
  };
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

const Dashboard = () => {
  const { toast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch reservations with tour info
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
      setMessages(messagesData || []);

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
      setReservations(prev => 
        prev.map(reservation => 
          reservation.id === id ? { ...reservation, status } : reservation
        )
      );

      toast({
        title: "Estado actualizado",
        description: "El estado de la reserva ha sido actualizado",
      });

      // Si se aprueba la reserva, enviar confirmación por WhatsApp
      if (status === 'confirmed') {
        const reservation = reservations.find(r => r.id === id);
        if (reservation) {
          sendWhatsAppConfirmation(reservation);
        }
      }

    } catch (error) {
      console.error('Error updating reservation status:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive",
      });
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
      setMessages(prev => 
        prev.map(message => 
          message.id === id ? { ...message, status } : message
        )
      );

      toast({
        title: "Estado actualizado",
        description: "El estado del mensaje ha sido actualizado",
      });

    } catch (error) {
      console.error('Error updating message status:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive",
      });
    }
  };

  const sendWhatsAppConfirmation = (reservation: Reservation) => {
    const tourTitle = reservation.posts?.title || 'Tour';
    const totalPrice = reservation.posts?.price ? (reservation.posts.price * reservation.guests).toFixed(2) : '0.00';
    
    const confirmationMessage = `🎉 *RESERVA CONFIRMADA - Jon Tours and Adventure* 🎉

¡Hola ${reservation.name}! Tu reserva ha sido confirmada exitosamente.

📋 *Detalles confirmados:*
• Tour: ${tourTitle}
• Fecha: ${reservation.date}
• Huéspedes: ${reservation.guests}
• Total: $${totalPrice}

${reservation.special_requests ? `📝 *Tus solicitudes especiales:*\n${reservation.special_requests}\n\n` : ''}📞 Nos pondremos en contacto contigo 24-48 horas antes del tour para confirmar la hora y punto de encuentro.

¡Esperamos verte pronto para esta increíble aventura! 🌴

*Jon Tours and Adventure*
+1 (809) 840-8257`;

    // Limpiar el número de teléfono y crear el enlace de WhatsApp
    const cleanPhone = reservation.phone.replace(/\D/g, '');
    const phoneNumber = cleanPhone.startsWith('1') ? cleanPhone : `1${cleanPhone}`;
    const encodedMessage = encodeURIComponent(confirmationMessage);
    
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  // Filter functions
  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = searchTerm === '' || 
      reservation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (reservation.posts?.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const filteredMessages = messages.filter(message => {
    const matchesSearch = searchTerm === '' || 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

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
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  Dashboard - Jon Tours
                </h1>
                <p className="text-sm text-gray-600 hidden sm:block">Panel de administración</p>
              </div>
            </div>
            
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="text-sm"
            >
              Volver al sitio
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Reservas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reservations.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Reservas Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {reservations.filter(r => r.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Reservas Confirmadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {reservations.filter(r => r.status === 'confirmed').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Mensajes Nuevos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {messages.filter(m => m.status === 'unread').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('all')}
              size="sm"
            >
              Todos
            </Button>
            <Button
              variant={statusFilter === 'pending' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('pending')}
              size="sm"
            >
              Pendientes
            </Button>
            <Button
              variant={statusFilter === 'confirmed' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('confirmed')}
              size="sm"
            >
              Confirmados
            </Button>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="reservations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reservations" className="text-sm">
              Reservas ({filteredReservations.length})
            </TabsTrigger>
            <TabsTrigger value="messages" className="text-sm">
              Mensajes ({filteredMessages.length})
            </TabsTrigger>
          </TabsList>

          {/* Reservations Tab */}
          <TabsContent value="reservations">
            <Card>
              <CardHeader>
                <CardTitle>Reservas de Tours</CardTitle>
                <CardDescription>
                  Gestiona las reservas recibidas de los clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[120px]">Cliente</TableHead>
                        <TableHead className="hidden sm:table-cell">Tour</TableHead>
                        <TableHead className="hidden md:table-cell">Fecha</TableHead>
                        <TableHead className="hidden md:table-cell">Huéspedes</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReservations.map((reservation) => (
                        <TableRow key={reservation.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{reservation.name}</div>
                              <div className="text-sm text-gray-500 sm:hidden">
                                {reservation.posts?.title || 'Tour'}
                              </div>
                              <div className="text-sm text-gray-500">{reservation.email}</div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <div>
                              <div className="font-medium">{reservation.posts?.title || 'Tour'}</div>
                              <div className="text-sm text-gray-500">
                                ${reservation.posts?.price ? (reservation.posts.price * reservation.guests).toFixed(2) : '0.00'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{reservation.date}</TableCell>
                          <TableCell className="hidden md:table-cell">{reservation.guests}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                reservation.status === 'confirmed' ? 'default' : 
                                reservation.status === 'pending' ? 'secondary' : 
                                'destructive'
                              }
                            >
                              {reservation.status === 'confirmed' ? 'Confirmada' : 
                               reservation.status === 'pending' ? 'Pendiente' : 
                               'Cancelada'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col sm:flex-row gap-2">
                              {reservation.status === 'pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                                    className="bg-green-600 hover:bg-green-700 text-xs"
                                  >
                                    <Check className="w-3 h-3 mr-1" />
                                    Aprobar
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                                    className="text-xs"
                                  >
                                    <X className="w-3 h-3 mr-1" />
                                    Rechazar
                                  </Button>
                                </>
                              )}
                              
                              {reservation.status === 'confirmed' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => sendWhatsAppConfirmation(reservation)}
                                  className="text-xs"
                                >
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  WhatsApp
                                </Button>
                              )}
                              
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline" className="text-xs">
                                    <Eye className="w-3 h-3 mr-1" />
                                    Ver
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Detalles de la Reserva</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="font-semibold">Información del Cliente</h4>
                                        <p><strong>Nombre:</strong> {reservation.name}</p>
                                        <p><strong>Email:</strong> {reservation.email}</p>
                                        <p><strong>Teléfono:</strong> {reservation.phone}</p>
                                      </div>
                                      <div>
                                        <h4 className="font-semibold">Detalles del Tour</h4>
                                        <p><strong>Tour:</strong> {reservation.posts?.title || 'Tour'}</p>
                                        <p><strong>Fecha:</strong> {reservation.date}</p>
                                        <p><strong>Huéspedes:</strong> {reservation.guests}</p>
                                        <p><strong>Precio total:</strong> ${reservation.posts?.price ? (reservation.posts.price * reservation.guests).toFixed(2) : '0.00'}</p>
                                      </div>
                                    </div>
                                    {reservation.special_requests && (
                                      <div>
                                        <h4 className="font-semibold">Solicitudes Especiales</h4>
                                        <p className="text-gray-600">{reservation.special_requests}</p>
                                      </div>
                                    )}
                                    <div>
                                      <h4 className="font-semibold">Fecha de Reserva</h4>
                                      <p>{new Date(reservation.created_at).toLocaleString()}</p>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Mensajes de Contacto</CardTitle>
                <CardDescription>
                  Gestiona los mensajes recibidos del formulario de contacto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[120px]">Remitente</TableHead>
                        <TableHead className="hidden sm:table-cell">Asunto</TableHead>
                        <TableHead className="hidden md:table-cell">Fecha</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMessages.map((message) => (
                        <TableRow key={message.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{message.name}</div>
                              <div className="text-sm text-gray-500">{message.email}</div>
                              <div className="text-sm text-gray-500 sm:hidden">
                                {message.subject}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <div className="max-w-xs truncate">{message.subject}</div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {new Date(message.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={message.status === 'read' ? 'default' : 'secondary'}>
                              {message.status === 'read' ? 'Leído' : 'Nuevo'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col sm:flex-row gap-2">
                              {message.status === 'unread' && (
                                <Button
                                  size="sm"
                                  onClick={() => updateMessageStatus(message.id, 'read')}
                                  className="text-xs"
                                >
                                  Marcar Leído
                                </Button>
                              )}
                              
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline" className="text-xs">
                                    <Eye className="w-3 h-3 mr-1" />
                                    Ver
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Mensaje de Contacto</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="font-semibold">De: {message.name}</h4>
                                      <p className="text-gray-600">{message.email}</p>
                                      {message.phone && <p className="text-gray-600">{message.phone}</p>}
                                    </div>
                                    <div>
                                      <h4 className="font-semibold">Asunto</h4>
                                      <p>{message.subject}</p>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold">Mensaje</h4>
                                      <p className="whitespace-pre-wrap">{message.message}</p>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold">Fecha</h4>
                                      <p>{new Date(message.created_at).toLocaleString()}</p>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
