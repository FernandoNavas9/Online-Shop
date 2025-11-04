
import React from 'react';
import { ImagePost } from '../types';
import ImageCard from './ImageCard';
import { ImageIcon } from './icons';

interface ImageListProps {
  images: ImagePost[];
}

const ImageList: React.FC<ImageListProps> = ({ images }) => {
  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg h-full">
        <ImageIcon className="h-16 w-16 text-slate-400 dark:text-slate-500 mb-4" />
        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Your Gallery is Empty</h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Upload your first image to see it appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {images.map((image) => (
        <ImageCard key={image.id} imagePost={image} />
      ))}
    </div>
  );
};

export default ImageList;
