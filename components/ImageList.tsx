
import React from 'react';
import ImageCard from './ImageCard';

interface ImageListProps {
  images: string[];
  onRemoveImage: (url: string) => void;
}

const ImageList: React.FC<ImageListProps> = ({ images, onRemoveImage }) => {
  if (images.length === 0) {
    return (
        <div className="h-24 flex items-center justify-center bg-gray-50 rounded-lg text-sm text-gray-500">
            No hay imágenes subidas.
        </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((url) => (
        <ImageCard key={url} imageUrl={url} onRemove={() => onRemoveImage(url)} />
      ))}
    </div>
  );
};

export default ImageList;
