import React from 'react';
import { Image } from '../types';
import { XIcon } from './icons';

interface ImageCardProps {
  image: Image;
  onRemove: (id: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onRemove }) => {
  return (
    <div className="relative group aspect-square">
      <img src={image.url} alt={image.alt} className="w-full h-full object-cover rounded-lg" />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 rounded-lg" />
      <button
        type="button"
        onClick={() => onRemove(image.id)}
        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100"
        aria-label="Remove image"
      >
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ImageCard;
