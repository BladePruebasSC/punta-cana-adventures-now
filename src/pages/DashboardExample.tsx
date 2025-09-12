// EJEMPLO DE INTEGRACIÓN DEL COMPONENTE MultiImageUpload EN EL DASHBOARD
// Este archivo muestra cómo integrar el nuevo componente en el Dashboard existente

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import MultiImageUpload from '@/components/MultiImageUpload';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Ejemplo de cómo integrar el componente en el Dashboard
const DashboardImageManager = () => {
  const [showMultiImageDialog, setShowMultiImageDialog] = useState(false);
  const [selectedTour, setSelectedTour] = useState<any>(null);
  const { toast } = useToast();

  // Función para manejar múltiples imágenes
  const handleAddMultipleImages = async (images: { url: string; altText: string }[]) => {
    if (!selectedTour) {
      toast({
        title: "Error",
        description: "No se ha seleccionado ningún tour",
        variant: "destructive",
      });
      return;
    }

    if (images.length === 0) {
      toast({
        title: "Error",
        description: "No hay imágenes para agregar",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Adding multiple images:', {
        tourId: selectedTour.id,
        count: images.length
      });

      // Obtener el siguiente order_index
      const { data: existingImages } = await supabase
        .from('tour_images')
        .select('order_index')
        .eq('tour_id', selectedTour.id)
        .order('order_index', { ascending: false })
        .limit(1);

      let nextOrderIndex = 0;
      if (existingImages && existingImages.length > 0) {
        nextOrderIndex = existingImages[0].order_index + 1;
      }

      // Preparar los datos para inserción en lote
      const imageData = images.map(image => ({
        tour_id: selectedTour.id,
        image_url: image.url,
        alt_text: image.altText,
        is_primary: false,
        order_index: nextOrderIndex++
      }));

      // Insertar todas las imágenes en una sola operación
      const { data, error } = await supabase
        .from('tour_images')
        .insert(imageData)
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Multiple images added successfully:', data);

      toast({
        title: "¡Éxito!",
        description: `${images.length} imagen(es) agregada(s) correctamente al tour`,
      });

      // Cerrar el diálogo
      setShowMultiImageDialog(false);

    } catch (error) {
      console.error('Error adding multiple images:', error);
      
      let errorMessage = "No se pudieron agregar las imágenes";
      
      if (error instanceof Error) {
        if (error.message.includes('duplicate key')) {
          errorMessage = "Algunas imágenes ya existen para este tour";
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
    }
  };

  return (
    <div>
      {/* Botón para abrir el diálogo de múltiples imágenes */}
      <Button
        onClick={() => {
          setSelectedTour({ id: 'tour-id-example', title: 'Tour de Ejemplo' });
          setShowMultiImageDialog(true);
        }}
        className="bg-green-600 hover:bg-green-700"
      >
        Agregar Múltiples Imágenes
      </Button>

      {/* Diálogo para agregar múltiples imágenes */}
      <Dialog open={showMultiImageDialog} onOpenChange={setShowMultiImageDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agregar Múltiples Imágenes</DialogTitle>
            <DialogDescription>
              Agrega múltiples imágenes al tour: {selectedTour?.title}
            </DialogDescription>
          </DialogHeader>
          
           <div className="space-y-6">
             <MultiImageUpload
               onImagesChange={handleAddMultipleImages}
               label="Imágenes Adicionales del Tour"
               maxFiles={10}
               maxSizeMB={10}
               bucket="tour-images"
               baseAltText="Imagen del tour"
             />
             
             <div className="mt-4 p-4 bg-blue-50 rounded-lg">
               <h4 className="font-semibold text-blue-900 mb-2">💡 Nuevas Características:</h4>
               <ul className="text-sm text-blue-800 space-y-1">
                 <li>• <strong>Selección múltiple:</strong> Haz clic en "Seleccionar" para elegir múltiples imágenes</li>
                 <li>• <strong>Texto automático:</strong> El nombre del archivo se convierte automáticamente en descripción</li>
                 <li>• <strong>Eliminación masiva:</strong> Selecciona varias imágenes y elimínalas de una vez</li>
                 <li>• <strong>Vista previa:</strong> Ve todas las imágenes antes de subirlas</li>
                 <li>• <strong>Estados visuales:</strong> Cada imagen muestra su estado (pendiente, subiendo, éxito, error)</li>
               </ul>
             </div>
           </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMultiImageDialog(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardImageManager;
