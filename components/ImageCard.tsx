
import React from 'react';
import { ImagePost } from '../types';

interface ImageCardProps {
  imagePost: ImagePost;
}

const ImageCard: React.FC<ImageCardProps> = ({ imagePost }) => {
  return (
    <div className="group relative bg-white dark:bg-slate-800 shadow-lg rounded-lg overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105">
      <img
        src={imagePost.imageUrl}
        alt={imagePost.description}
        className="w-full h-56 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-4">
        <p className="text-white text-sm leading-tight line-clamp-3">{imagePost.description}</p>
      </div>
    </div>
  );
};

export default ImageCard;
