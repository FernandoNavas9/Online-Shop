
import React from 'react';
import { X } from 'lucide-react';

interface ImageCardProps {
  imageUrl: string;
  onRemove: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ imageUrl, onRemove }) => {
  return (
    <div className="relative aspect-square group">
      <img src={imageUrl} alt="Uploaded product" className="w-full h-full object-cover rounded-lg shadow-sm" />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
        <button
          onClick={onRemove}
          className="absolute top-1 right-1 bg-white/70 text-gray-800 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
          aria-label="Remove image"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default ImageCard;
