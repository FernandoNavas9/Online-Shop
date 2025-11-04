import React from 'react';
import { Image } from '../types';
import ImageCard from './ImageCard';

interface ImageListProps {
  images: Image[];
  onRemoveImage: (id: string) => void;
}

const ImageList: React.FC<ImageListProps> = ({ images, onRemoveImage }) => {
  if (images.length === 0) {
    return null;
  }
  
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
      {images.map(image => (
        <ImageCard key={image.id} image={image} onRemove={onRemoveImage} />
      ))}
    </div>
  );
};

export default ImageList;
