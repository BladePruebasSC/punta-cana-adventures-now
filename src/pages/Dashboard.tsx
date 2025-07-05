import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Plus, Edit, Trash2, Eye, Calendar, Users, MapPin, Image, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ADMIN_PASSWORD = "admin123";

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
  created_at: string;
}

interface TourImage {
  id: string;
  tour_id: string;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  order_index: number;
}

interface Reservation {
  id: string;
  tour_id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  guests: number;
  special_requests: string;
  status: string;
  created_at: string;
  posts?: { title: string };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('tours');
  const [tours, setTours] = useState<Tour[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImagesDialogOpen, setIsImagesDialogOpen] = useState(false);
  const [selectedTourImages, setSelectedTourImages] = useState<TourImage[]>([]);
  const [selectedTourId, setSelectedTourId] = useState<string>('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');

  const [tourForm, setTourForm] = useState({
    title: '',
    description: '',
    image_url: '',
    price: '',
    duration: '',
    rating: '4.5',
    category: 'aventura',
    group_size: '',
    highlights: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchTours();
      fetchReservations();
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast({
        title: "Acceso concedido",
        description: "Bienvenido al dashboard de administración",
      });
    } else {
      toast({
        title: "Error de autenticación",
        description: "Contraseña incorrecta",
        variant: "destructive",
      });
    }
  };

  const fetchTours = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTours(data || []);
    } catch (error) {
      console.error('Error fetching tours:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los tours",
        variant: "destructive",
      });
    }
  };

  const fetchReservations = async () => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          posts (title)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReservations(data || []);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las reservas",
        variant: "destructive",
      });
    }
  };

  const fetchTourImages = async (tourId: string) => {
    try {
      const { data, error } = await supabase
        .from('tour_images')
        .select('*')
        .eq('tour_id', tourId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setSelectedTourImages(data || []);
    } catch (error) {
      console.error('Error fetching tour images:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las imágenes",
        variant: "destructive",
      });
    }
  };

  const handleManageImages = async (tour: Tour) => {
    setSelectedTourId(tour.id);
    await fetchTourImages(tour.id);
    setIsImagesDialogOpen(true);
  };

  const handleAddImage = async () => {
    if (!newImageUrl.trim()) {
      toast({
        title: "Error",
        description: "La URL de la imagen es requerida",
        variant: "destructive",
      });
      return;
    }

    try {
      const maxOrderIndex = Math.max(...selectedTourImages.map(img => img.order_index), -1);
      
      const { error } = await supabase
        .from('tour_images')
        .insert([
          {
            tour_id: selectedTourId,
            image_url: newImageUrl,
            alt_text: newImageAlt || 'Imagen del tour',
            is_primary: false,
            order_index: maxOrderIndex + 1
          }
        ]);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Imagen agregada correctamente",
      });

      setNewImageUrl('');
      setNewImageAlt('');
      await fetchTourImages(selectedTourId);
    } catch (error) {
      console.error('Error adding image:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar la imagen",
        variant: "destructive",
      });
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
      try {
        const { error } = await supabase
          .from('tour_images')
          .delete()
          .eq('id', imageId);

        if (error) throw error;

        toast({
          title: "Éxito",
          description: "Imagen eliminada correctamente",
        });

        await fetchTourImages(selectedTourId);
      } catch (error) {
        console.error('Error deleting image:', error);
        toast({
          title: "Error",
          description: "No se pudo eliminar la imagen",
          variant: "destructive",
        });
      }
    }
  };

  const handleSetPrimaryImage = async (imageId: string) => {
    try {
      // First, set all images as non-primary
      await supabase
        .from('tour_images')
        .update({ is_primary: false })
        .eq('tour_id', selectedTourId);

      // Then set the selected image as primary
      const { error } = await supabase
        .from('tour_images')
        .update({ is_primary: true })
        .eq('id', imageId);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Imagen principal actualizada",
      });

      await fetchTourImages(selectedTourId);
    } catch (error) {
      console.error('Error setting primary image:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la imagen principal",
        variant: "destructive",
      });
    }
  };

  const handleSaveTour = async () => {
    try {
      const highlights = tourForm.highlights.split(',').map(h => h.trim()).filter(h => h);
      
      const tourData = {
        title: tourForm.title,
        description: tourForm.description,
        image_url: tourForm.image_url,
        price: parseFloat(tourForm.price),
        duration: tourForm.duration,
        rating: parseFloat(tourForm.rating),
        category: tourForm.category,
        group_size: tourForm.group_size,
        highlights,
      };

      let error;
      if (editingTour) {
        ({ error } = await supabase
          .from('posts')
          .update(tourData)
          .eq('id', editingTour.id));
      } else {
        ({ error } = await supabase
          .from('posts')
          .insert([tourData]));
      }

      if (error) throw error;

      toast({
        title: "Éxito",
        description: editingTour ? "Tour actualizado correctamente" : "Tour creado correctamente",
      });

      setIsDialogOpen(false);
      resetForm();
      fetchTours();
    } catch (error) {
      console.error('Error saving tour:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el tour",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTour = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este tour?')) {
      try {
        const { error } = await supabase
          .from('posts')
          .delete()
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Éxito",
          description: "Tour eliminado correctamente",
        });
        
        fetchTours();
      } catch (error) {
        console.error('Error deleting tour:', error);
        toast({
          title: "Error",
          description: "No se pudo eliminar el tour",
          variant: "destructive",
        });
      }
    }
  };

  const handleEditTour = (tour: Tour) => {
    setEditingTour(tour);
    setTourForm({
      title: tour.title,
      description: tour.description,
      image_url: tour.image_url,
      price: tour.price.toString(),
      duration: tour.duration,
      rating: tour.rating.toString(),
      category: tour.category,
      group_size: tour.group_size,
      highlights: tour.highlights.join(', ')
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingTour(null);
    setTourForm({
      title: '',
      description: '',
      image_url: '',
      price: '',
      duration: '',
      rating: '4.5',
      category: 'aventura',
      group_size: '',
      highlights: ''
    });
  };

  const updateReservationStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Estado de reserva actualizado",
      });
      
      fetchReservations();
    } catch (error) {
      console.error('Error updating reservation:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la reserva",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-emerald-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Dashboard de Administración</CardTitle>
            <CardDescription>Ingresa la contraseña para acceder</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Ingresa la contraseña"
              />
            </div>
            <Button onClick={handleLogin} className="w-full bg-gradient-to-r from-blue-600 to-emerald-600">
              Acceder
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')} 
              className="w-full"
            >
              Volver al Inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-emerald-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Dashboard - Jon Tours</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                Ver Sitio Web
              </Button>
              <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tours</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tours.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reservas Totales</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reservations.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reservas Pendientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reservations.filter(r => r.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 mb-6">
          <Button
            variant={activeTab === 'tours' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('tours')}
            className="flex-1"
          >
            Gestionar Tours
          </Button>
          <Button
            variant={activeTab === 'reservations' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('reservations')}
            className="flex-1"
          >
            Ver Reservas
          </Button>
        </div>

        {/* Tours Tab */}
        {activeTab === 'tours' && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Gestión de Tours</CardTitle>
                  <CardDescription>Administra todos los tours disponibles</CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetForm} className="bg-gradient-to-r from-blue-600 to-emerald-600">
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo Tour
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingTour ? 'Editar Tour' : 'Crear Nuevo Tour'}
                      </DialogTitle>
                      <DialogDescription>
                        Completa la información del tour
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Título</Label>
                          <Input
                            id="title"
                            value={tourForm.title}
                            onChange={(e) => setTourForm({...tourForm, title: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="price">Precio (USD)</Label>
                          <Input
                            id="price"
                            type="number"
                            value={tourForm.price}
                            onChange={(e) => setTourForm({...tourForm, price: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea
                          id="description"
                          value={tourForm.description}
                          onChange={(e) => setTourForm({...tourForm, description: e.target.value})}
                          rows={3}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="image_url">URL de Imagen</Label>
                        <Input
                          id="image_url"
                          value={tourForm.image_url}
                          onChange={(e) => setTourForm({...tourForm, image_url: e.target.value})}
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="duration">Duración</Label>
                          <Input
                            id="duration"
                            value={tourForm.duration}
                            onChange={(e) => setTourForm({...tourForm, duration: e.target.value})}
                            placeholder="ej: 8 horas"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rating">Rating</Label>
                          <Input
                            id="rating"
                            type="number"
                            step="0.1"
                            min="1"
                            max="5"
                            value={tourForm.rating}
                            onChange={(e) => setTourForm({...tourForm, rating: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category">Categoría</Label>
                          <select
                            id="category"
                            value={tourForm.category}
                            onChange={(e) => setTourForm({...tourForm, category: e.target.value})}
                            className="w-full h-10 px-3 rounded-md border border-input bg-background"
                          >
                            <option value="aventura">Aventura</option>
                            <option value="playa">Playa & Mar</option>
                            <option value="cultura">Cultura</option>
                            <option value="naturaleza">Naturaleza</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="group_size">Tamaño del Grupo</Label>
                        <Input
                          id="group_size"
                          value={tourForm.group_size}
                          onChange={(e) => setTourForm({...tourForm, group_size: e.target.value})}
                          placeholder="ej: 2-15 personas"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="highlights">Destacados (separados por coma)</Label>
                        <Textarea
                          id="highlights"
                          value={tourForm.highlights}
                          onChange={(e) => setTourForm({...tourForm, highlights: e.target.value})}
                          placeholder="ej: Almuerzo incluido, Snorkeling, Transporte"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleSaveTour} className="bg-gradient-to-r from-blue-600 to-emerald-600">
                        {editingTour ? 'Actualizar' : 'Crear'} Tour
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {tours.map((tour) => (
                  <div key={tour.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <img 
                      src={tour.image_url} 
                      alt={tour.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{tour.title}</h3>
                      <p className="text-gray-600 text-sm">{tour.description.substring(0, 100)}...</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant="outline">${tour.price}</Badge>
                        <Badge variant="outline">{tour.duration}</Badge>
                        <Badge variant="outline">{tour.category}</Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleManageImages(tour)}
                      >
                        <Image className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditTour(tour)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteTour(tour.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Images Management Dialog */}
        <Dialog open={isImagesDialogOpen} onOpenChange={setIsImagesDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Gestionar Imágenes del Tour</DialogTitle>
              <DialogDescription>
                Agrega, elimina y organiza las imágenes del tour
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Add New Image */}
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-semibold">Agregar Nueva Imagen</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-image-url">URL de la Imagen *</Label>
                    <Input
                      id="new-image-url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-image-alt">Texto Alternativo</Label>
                    <Input
                      id="new-image-alt"
                      value={newImageAlt}
                      onChange={(e) => setNewImageAlt(e.target.value)}
                      placeholder="Descripción de la imagen"
                    />
                  </div>
                </div>
                <Button onClick={handleAddImage} className="bg-gradient-to-r from-blue-600 to-emerald-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Imagen
                </Button>
              </div>

              {/* Current Images */}
              <div className="space-y-4">
                <h4 className="font-semibold">Imágenes Actuales ({selectedTourImages.length})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedTourImages.map((image) => (
                    <div key={image.id} className="relative border rounded-lg overflow-hidden">
                      <img 
                        src={image.image_url} 
                        alt={image.alt_text}
                        className="w-full h-48 object-cover"
                      />
                      
                      {image.is_primary && (
                        <Badge className="absolute top-2 left-2 bg-green-600">
                          Principal
                        </Badge>
                      )}
                      
                      <div className="p-3 space-y-2">
                        <p className="text-sm text-gray-600 truncate">
                          {image.alt_text || 'Sin descripción'}
                        </p>
                        
                        <div className="flex space-x-1">
                          {!image.is_primary && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSetPrimaryImage(image.id)}
                              className="text-xs"
                            >
                              Hacer Principal
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteImage(image.id)}
                            className="text-xs"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {selectedTourImages.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No hay imágenes para este tour. Agrega la primera imagen arriba.
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsImagesDialogOpen(false)}>
                Cerrar
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Reservations Tab */}
        {activeTab === 'reservations' && (
          <Card>
            <CardHeader>
              <CardTitle>Reservas de Tours</CardTitle>
              <CardDescription>Administra todas las reservas realizadas</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tour</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Huéspedes</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium">
                        {reservation.posts?.title || 'Tour eliminado'}
                      </TableCell>
                      <TableCell>{reservation.name}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{reservation.email}</div>
                          <div className="text-muted-foreground">{reservation.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(reservation.date).toLocaleDateString()}</TableCell>
                      <TableCell>{reservation.guests}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            reservation.status === 'confirmed' ? 'default' :
                            reservation.status === 'pending' ? 'secondary' :
                            'destructive'
                          }
                        >
                          {reservation.status === 'pending' ? 'Pendiente' :
                           reservation.status === 'confirmed' ? 'Confirmada' :
                           reservation.status === 'cancelled' ? 'Cancelada' : reservation.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                            disabled={reservation.status === 'confirmed'}
                          >
                            Confirmar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                            disabled={reservation.status === 'cancelled'}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
