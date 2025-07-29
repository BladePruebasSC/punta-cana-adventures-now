import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ImageUpload from './ImageUpload';

const ImageUploadTest: React.FC = () => {
  const [testImageUrl, setTestImageUrl] = React.useState('');

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Prueba de Subida de Imágenes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImageUpload
            currentImageUrl={testImageUrl}
            onImageChange={setTestImageUrl}
            label="Imagen de Prueba"
            bucket="site-images"
            maxSizeMB={5}
          />
          
          {testImageUrl && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">URL de la imagen:</h4>
              <p className="text-sm text-gray-600 break-all">
                {testImageUrl.substring(0, 100)}...
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Longitud: {testImageUrl.length} caracteres
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageUploadTest; 