import React from 'react';
import { X } from 'lucide-react';

interface ImageCardProps {
  src: string;
  onRemove: () => void;
  isPrimary?: boolean;
}

const ImageCard: React.FC<ImageCardProps> = ({ src, onRemove, isPrimary }) => {
  return (
    <div className="relative w-24 h-24 rounded-md overflow-hidden group">
      <img src={src} alt="Product" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={onRemove}
          className="text-white p-1 bg-red-500 rounded-full hover:bg-red-600"
          aria-label="Remove image"
        >
          <X size={16} />
        </button>
      </div>
      {isPrimary && (
        <div className="absolute bottom-0 left-0 right-0 bg-brand-primary text-white text-xs text-center py-0.5">
          Principal
        </div>
      )}
    </div>
  );
};

export default ImageCard;
