import React from 'react';
import ImageCard from './ImageCard';

interface ImageListProps {
  images: string[];
  onRemoveImage: (index: number) => void;
}

const ImageList: React.FC<ImageListProps> = ({ images, onRemoveImage }) => {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
      {images.map((image, index) => (
        <ImageCard
          key={index}
          src={image}
          onRemove={() => onRemoveImage(index)}
          isPrimary={index === 0}
        />
      ))}
    </div>
  );
};

export default ImageList;
