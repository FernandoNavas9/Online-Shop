import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { LoaderCircle, Upload } from 'lucide-react';

interface ImageUploaderProps {
  onImagesUploaded: (imageUrls: string[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesUploaded }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      return;
    }
    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    acceptedFiles.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Image upload failed');
      }

      const { urls } = await response.json();
      onImagesUploaded(urls);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setUploadError(message);
    } finally {
      setIsUploading(false);
    }
  }, [onImagesUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
      'image/gif': [],
    },
    multiple: true,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-brand-primary bg-brand-secondary' : 'border-gray-300 hover:border-brand-primary'}`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="flex flex-col items-center justify-center">
            <LoaderCircle className="w-8 h-8 animate-spin text-brand-primary" />
            <p className="mt-2 text-sm text-gray-500">Subiendo...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Upload className="w-8 h-8 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              {isDragActive ? 'Suelta las imágenes aquí' : 'Arrastra y suelta imágenes aquí, o haz clic para seleccionar'}
            </p>
            <p className="text-xs text-gray-400">PNG, JPG, WEBP, GIF</p>
          </div>
        )}
      </div>
      {uploadError && <p className="mt-2 text-sm text-red-500">{uploadError}</p>}
    </div>
  );
};

export default ImageUploader;
