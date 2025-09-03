import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadImage, validateImageUrl, checkImageAccessibility } from '@/lib/imageUpload';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageChange: (imageUrl: string) => void;
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  bucket?: 'site-images' | 'tour-images';
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImageUrl,
  onImageChange,
  label = "Imagen",
  accept = "image/*",
  maxSizeMB = 5,
  bucket = 'site-images'
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl || '');
  const [urlInput, setUrlInput] = useState<string>(currentImageUrl || '');
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Actualizar preview cuando cambie la imagen actual
  React.useEffect(() => {
    if (currentImageUrl) {
      setPreviewUrl(currentImageUrl);
      setUrlInput(currentImageUrl);
    }
  }, [currentImageUrl]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: "Archivo muy grande",
        description: `El archivo debe ser menor a ${maxSizeMB}MB`,
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Tipo de archivo inválido",
        description: "Solo se permiten archivos de imagen",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Upload file to Supabase Storage
      const result = await uploadImage(file, bucket);
      
      if (result.error) {
        toast({
          title: "Error al subir imagen",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      // Set preview and notify parent
      setPreviewUrl(result.url);
      onImageChange(result.url);

      toast({
        title: "Imagen subida exitosamente",
        description: "La imagen se ha subido y está lista para usar",
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "No se pudo subir la imagen",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) {
      toast({
        title: "URL requerida",
        description: "Por favor ingresa una URL válida",
        variant: "destructive",
      });
      return;
    }

    // Validate URL format
    if (!validateImageUrl(urlInput)) {
      toast({
        title: "URL inválida",
        description: "Por favor ingresa una URL válida que comience con http:// o https://",
        variant: "destructive",
      });
      return;
    }

    // Test if the image can be loaded
    setUploading(true);
    try {
      // Primero verificar si la imagen es accesible
      const isAccessible = await checkImageAccessibility(urlInput);
      if (!isAccessible) {
        throw new Error('La imagen no es accesible o no es una imagen válida');
      }
      
      // Luego cargar la imagen para verificar que se puede mostrar
      const img = new Image();
      const loadPromise = new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('No se pudo cargar la imagen'));
        // Set a timeout to prevent hanging
        setTimeout(() => reject(new Error('Tiempo de espera agotado')), 10000);
      });
      
      img.src = urlInput;
      await loadPromise;
      
      setPreviewUrl(urlInput);
      onImageChange(urlInput);
      toast({
        title: "URL actualizada",
        description: "La imagen se ha actualizado correctamente",
      });
    } catch (error) {
      console.error('Error loading image from URL:', error);
      toast({
        title: "Error al cargar imagen",
        description: error instanceof Error ? error.message : "No se pudo cargar la imagen desde la URL proporcionada. Verifica que la URL sea correcta y que la imagen sea accesible.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const clearImage = () => {
    setPreviewUrl('');
    setUrlInput('');
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
          Subir Archivo
        </Button>
        <Button
          type="button"
          variant={uploadMethod === 'url' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUploadMethod('url')}
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          URL de Imagen
        </Button>
      </div>

      {/* File Upload */}
      {uploadMethod === 'file' && (
        <div className="space-y-2">
          <div className="relative">
            <Input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileSelect}
              disabled={uploading}
              className="cursor-pointer"
            />
            {uploading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-md">
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Procesando imagen...
                </div>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500">
            Máximo {maxSizeMB}MB. Formatos: JPG, PNG, GIF, WebP
          </p>
          <p className="text-xs text-blue-600">
            💡 Las imágenes se procesan localmente para mejor rendimiento
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
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim() || uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verificando...
                </>
              ) : (
                'Aplicar'
              )}
            </Button>
          </div>
          <div className="text-sm text-gray-500 space-y-1">
            <p>Ingresa la URL de una imagen válida (JPG, PNG, GIF, WebP)</p>
            <p className="text-xs text-blue-600">
              💡 Ejemplos de URLs válidas:
            </p>
            <ul className="text-xs text-gray-600 ml-2 space-y-1">
              <li>• https://images.unsplash.com/photo-1234567890.jpg</li>
              <li>• https://ejemplo.com/imagen.png</li>
              <li>• https://cdn.ejemplo.com/foto.webp</li>
            </ul>
          </div>
        </div>
      )}

      {/* Preview */}
      {previewUrl && (
        <div className="relative">
          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={() => {
                console.error('Error loading image:', previewUrl);
                toast({
                  title: "Error al cargar imagen",
                  description: "No se pudo cargar la imagen desde la URL proporcionada. Verifica que la URL sea correcta y que la imagen sea accesible.",
                  variant: "destructive",
                });
              }}
              onLoad={() => {
                console.log('Image loaded successfully:', previewUrl);
              }}
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 hover:bg-red-700"
              onClick={clearImage}
            >
              <X className="w-4 h-4" />
            </Button>
            
            {/* Info overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2">
              <p className="text-xs">
                {previewUrl.startsWith('data:') ? 'Imagen procesada localmente' : 'Imagen desde URL'}
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-gray-500">Vista previa de la imagen</span>
            {previewUrl.startsWith('data:') && (
              <span className="text-blue-600 text-xs">✅ Lista para usar</span>
            )}
          </div>
        </div>
      )}

      {uploading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Subiendo imagen...</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;