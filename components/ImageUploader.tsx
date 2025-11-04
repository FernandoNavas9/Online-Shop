
import React, { useState, useRef } from 'react';
import ImageList from './ImageList';
import { UploadCloud, LoaderCircle } from 'lucide-react';

interface ImageUploaderProps {
  initialImages: string[];
  onImagesChange: (images: string[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ initialImages, onImagesChange }) => {
  const [images, setImages] = useState<string[]>(initialImages);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Image upload failed');
        }

        const { url } = await response.json();
        uploadedUrls.push(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred during upload.');
        // Don't add partially uploaded images if one fails
        setIsUploading(false);
        return;
      }
    }
    
    const newImages = [...images, ...uploadedUrls];
    setImages(newImages);
    onImagesChange(newImages);
    setIsUploading(false);
  };
  
  const handleRemoveImage = (urlToRemove: string) => {
    const newImages = images.filter(url => url !== urlToRemove);
    setImages(newImages);
    onImagesChange(newImages);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
        <ImageList images={images} onRemoveImage={handleRemoveImage} />
        
        <div 
            onClick={triggerFileInput}
            className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-brand-primary transition-colors"
        >
            <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
                accept="image/png, image/jpeg, image/gif, image/webp"
            />
            {isUploading ? (
                <div className="flex flex-col items-center justify-center text-gray-500">
                    <LoaderCircle className="w-8 h-8 animate-spin mb-2" />
                    <span>Subiendo...</span>
                </div>
            ) : (
                <div className="text-gray-500">
                    <UploadCloud className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-semibold">Click para subir imágenes</p>
                    <p className="text-xs">PNG, JPG, GIF hasta 10MB</p>
                </div>
            )}
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default ImageUploader;
