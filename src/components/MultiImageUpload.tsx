import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon, Loader2, Check, AlertCircle, Trash2, CheckSquare, Square } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadImage, validateImageUrl, checkImageAccessibility } from '@/lib/imageUpload';

interface ImageData {
  id: string;
  file?: File;
  url?: string;
  altText: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  previewUrl?: string;
  isSelected?: boolean;
}

interface MultiImageUploadProps {
  onImagesChange: (images: { url: string; altText: string }[]) => void;
  label?: string;
  maxFiles?: number;
  maxSizeMB?: number;
  bucket?: 'site-images' | 'tour-images';
  baseAltText?: string;
}

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  onImagesChange,
  label = "Imágenes",
  maxFiles = 10,
  maxSizeMB = 10,
  bucket = 'tour-images',
  baseAltText = "Imagen del tour"
}) => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
  const [urlInput, setUrlInput] = useState('');
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const generateAltText = (index: number): string => {
    if (index === 0) return baseAltText;
    return `${baseAltText} ${index + 1}`;
  };

  const addImageFromFile = (files: FileList) => {
    const newImages: ImageData[] = [];
    
    Array.from(files).forEach((file, index) => {
      // Validar tamaño
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast({
          title: "Archivo muy grande",
          description: `${file.name} es mayor a ${maxSizeMB}MB`,
          variant: "destructive",
        });
        return;
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Tipo de archivo inválido",
          description: `${file.name} no es una imagen válida`,
          variant: "destructive",
        });
        return;
      }

      // Verificar límite de archivos
      if (images.length + newImages.length >= maxFiles) {
        toast({
          title: "Límite de archivos alcanzado",
          description: `Máximo ${maxFiles} imágenes permitidas`,
          variant: "destructive",
        });
        return;
      }

      const imageId = crypto.randomUUID();
      const altText = generateAltText(images.length + newImages.length);
      
      // Crear preview URL
      const previewUrl = URL.createObjectURL(file);
      
      newImages.push({
        id: imageId,
        file,
        altText,
        status: 'pending',
        previewUrl,
        isSelected: false
      });
    });

    if (newImages.length > 0) {
      setImages(prev => [...prev, ...newImages]);
      toast({
        title: `${newImages.length} imagen(es) agregada(s)`,
        description: "Las imágenes están listas para subir",
      });
    }
  };

  const addImageFromUrl = async () => {
    if (!urlInput.trim()) {
      toast({
        title: "URL requerida",
        description: "Por favor ingresa una URL válida",
        variant: "destructive",
      });
      return;
    }

    if (images.length >= maxFiles) {
      toast({
        title: "Límite de archivos alcanzado",
        description: `Máximo ${maxFiles} imágenes permitidas`,
        variant: "destructive",
      });
      return;
    }

    // Validar URL
    if (!validateImageUrl(urlInput)) {
      toast({
        title: "URL inválida",
        description: "Por favor ingresa una URL válida que comience con http:// o https://",
        variant: "destructive",
      });
      return;
    }

    const imageId = crypto.randomUUID();
    const altText = generateAltText(images.length);
    
    const newImage: ImageData = {
      id: imageId,
      url: urlInput,
      altText,
      status: 'pending',
      previewUrl: urlInput,
      isSelected: false
    };

    setImages(prev => [...prev, newImage]);
    setUrlInput('');
    
    toast({
      title: "Imagen agregada",
      description: "La imagen está lista para subir",
    });
  };

  const removeImage = (imageId: string) => {
    setImages(prev => {
      const updated = prev.filter(img => img.id !== imageId);
      updateParentImages(updated);
      return updated;
    });
    
    // Remover de selección si estaba seleccionada
    setSelectedImages(prev => {
      const updated = new Set(prev);
      updated.delete(imageId);
      return updated;
    });
  };

  const removeSelectedImages = () => {
    if (selectedImages.size === 0) {
      toast({
        title: "Ninguna imagen seleccionada",
        description: "Selecciona al menos una imagen para eliminar",
        variant: "destructive",
      });
      return;
    }

    setImages(prev => {
      const updated = prev.filter(img => !selectedImages.has(img.id));
      updateParentImages(updated);
      return updated;
    });
    
    setSelectedImages(new Set());
    setSelectionMode(false);
    
    toast({
      title: `${selectedImages.size} imagen(es) eliminada(s)`,
      description: "Las imágenes seleccionadas han sido eliminadas",
    });
  };

  const toggleImageSelection = (imageId: string) => {
    setSelectedImages(prev => {
      const updated = new Set(prev);
      if (updated.has(imageId)) {
        updated.delete(imageId);
      } else {
        updated.add(imageId);
      }
      return updated;
    });
  };

  const selectAllImages = () => {
    const allImageIds = images.map(img => img.id);
    setSelectedImages(new Set(allImageIds));
  };

  const deselectAllImages = () => {
    setSelectedImages(new Set());
  };

  const updateImageAltText = (imageId: string, altText: string) => {
    setImages(prev => {
      const updated = prev.map(img => 
        img.id === imageId ? { ...img, altText } : img
      );
      updateParentImages(updated);
      return updated;
    });
  };

  const updateParentImages = (imagesList: ImageData[]) => {
    const successImages = imagesList
      .filter(img => img.status === 'success')
      .map(img => ({
        url: img.url || '',
        altText: img.altText
      }));
    
    onImagesChange(successImages);
  };

  const uploadAllImages = async () => {
    const pendingImages = images.filter(img => img.status === 'pending');
    if (pendingImages.length === 0) return;

    setUploading(true);
    let successCount = 0;
    let errorCount = 0;

    // Procesar imágenes en lotes para mejor rendimiento
    const batchSize = 3;
    for (let i = 0; i < pendingImages.length; i += batchSize) {
      const batch = pendingImages.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (imageData) => {
        try {
          // Actualizar estado a uploading
          setImages(prev => prev.map(img => 
            img.id === imageData.id ? { ...img, status: 'uploading' } : img
          ));

          let result;
          
          if (imageData.file) {
            // Subir archivo
            result = await uploadImage(imageData.file, bucket);
          } else if (imageData.url) {
            // Verificar URL
            const isAccessible = await checkImageAccessibility(imageData.url);
            if (!isAccessible) {
              throw new Error('La imagen no es accesible');
            }
            result = { url: imageData.url, path: 'url' };
          } else {
            throw new Error('No hay archivo o URL válida');
          }

          if (result.error) {
            throw new Error(result.error);
          }

          // Actualizar estado a success
          setImages(prev => prev.map(img => 
            img.id === imageData.id 
              ? { ...img, status: 'success', url: result.url, error: undefined }
              : img
          ));

          successCount++;
        } catch (error) {
          console.error('Error uploading image:', error);
          
          // Actualizar estado a error
          setImages(prev => prev.map(img => 
            img.id === imageData.id 
              ? { 
                  ...img, 
                  status: 'error', 
                  error: error instanceof Error ? error.message : 'Error desconocido'
                }
              : img
          ));
          
          errorCount++;
        }
      });

      // Esperar a que termine el lote actual
      await Promise.allSettled(batchPromises);
      
      // Pequeña pausa entre lotes para no sobrecargar el servidor
      if (i + batchSize < pendingImages.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    setUploading(false);

    // Mostrar resumen
    if (successCount > 0 && errorCount === 0) {
      toast({
        title: "¡Éxito!",
        description: `${successCount} imagen(es) subida(s) correctamente`,
      });
    } else if (successCount > 0 && errorCount > 0) {
      toast({
        title: "Subida parcial",
        description: `${successCount} imagen(es) exitosa(s), ${errorCount} error(es)`,
        variant: "destructive",
      });
    } else if (errorCount > 0) {
      toast({
        title: "Error en la subida",
        description: `No se pudieron subir las imágenes`,
        variant: "destructive",
      });
    }

    // Actualizar imágenes del componente padre
    updateParentImages(images);
  };

  const getStatusIcon = (status: ImageData['status']) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <ImageIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: ImageData['status'], isSelected: boolean) => {
    if (isSelected) {
      return 'border-blue-500 bg-blue-50';
    }
    
    switch (status) {
      case 'uploading':
        return 'border-blue-300 bg-blue-50';
      case 'success':
        return 'border-green-300 bg-green-50';
      case 'error':
        return 'border-red-300 bg-red-50';
      default:
        return 'border-gray-300 bg-white';
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">{label}</Label>
      
      {/* Upload Method Toggle */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant={uploadMethod === 'file' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUploadMethod('file')}
        >
          <Upload className="w-4 h-4 mr-2" />
          Subir Archivos
        </Button>
        <Button
          type="button"
          variant={uploadMethod === 'url' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUploadMethod('url')}
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          Agregar URL
        </Button>
      </div>

      {/* File Upload */}
      {uploadMethod === 'file' && (
        <div className="space-y-2">
          <div className="relative">
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  addImageFromFile(e.target.files);
                }
              }}
              disabled={uploading}
              className="cursor-pointer"
            />
          </div>
          <p className="text-sm text-gray-500">
            Máximo {maxFiles} imágenes, {maxSizeMB}MB cada una. Formatos: JPG, PNG, GIF, WebP
          </p>
        </div>
      )}

      {/* URL Input */}
      {uploadMethod === 'url' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              disabled={uploading}
            />
            <Button
              type="button"
              onClick={addImageFromUrl}
              disabled={!urlInput.trim() || uploading}
            >
              Agregar
            </Button>
          </div>
        </div>
      )}

      {/* Images List */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">
              Imágenes seleccionadas ({images.length}/{maxFiles})
            </h4>
            <div className="flex gap-2">
              {!selectionMode ? (
                <>
                  <Button
                    onClick={() => setSelectionMode(true)}
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    <CheckSquare className="w-4 h-4 mr-2" />
                    Seleccionar
                  </Button>
                  <Button
                    onClick={uploadAllImages}
                    disabled={uploading || images.filter(img => img.status === 'pending').length === 0}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Subiendo...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Subir Todas
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={selectAllImages}
                    variant="outline"
                    size="sm"
                  >
                    <CheckSquare className="w-4 h-4 mr-2" />
                    Seleccionar Todas
                  </Button>
                  <Button
                    onClick={deselectAllImages}
                    variant="outline"
                    size="sm"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Deseleccionar
                  </Button>
                  <Button
                    onClick={removeSelectedImages}
                    variant="destructive"
                    size="sm"
                    disabled={selectedImages.size === 0}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar ({selectedImages.size})
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectionMode(false);
                      setSelectedImages(new Set());
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Cancelar
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className={`p-4 border-2 rounded-lg ${getStatusColor(image.status, selectedImages.has(image.id))}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {selectionMode && (
                      <button
                        onClick={() => toggleImageSelection(image.id)}
                        className="flex items-center justify-center w-5 h-5 border border-gray-300 rounded hover:bg-gray-50"
                      >
                        {selectedImages.has(image.id) ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    )}
                    {getStatusIcon(image.status)}
                    <span className="text-sm font-medium">
                      {image.file?.name || 'Imagen desde URL'}
                    </span>
                  </div>
                  {!selectionMode && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeImage(image.id)}
                      disabled={uploading}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {image.previewUrl && (
                  <div className="mb-3">
                    <img
                      src={image.previewUrl}
                      alt="Preview"
                      className="w-full h-24 object-cover rounded border"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Input
                    value={image.altText}
                    onChange={(e) => updateImageAltText(image.id, e.target.value)}
                    placeholder="Texto alternativo"
                    disabled={uploading}
                    className="text-sm"
                  />
                  
                  {image.status === 'error' && image.error && (
                    <p className="text-xs text-red-600">{image.error}</p>
                  )}
                  
                  {image.status === 'success' && (
                    <p className="text-xs text-green-600">✅ Subida exitosamente</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {uploading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Subiendo imágenes...</p>
        </div>
      )}
    </div>
  );
};

export default MultiImageUpload;
