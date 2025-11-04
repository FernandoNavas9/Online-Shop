import React, { ChangeEvent } from 'react';
import { Image } from '../types';
import { PlusIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (images: Image[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const newImages: Image[] = files.map(file => ({
        id: `${file.name}-${new Date().getTime()}`,
        url: URL.createObjectURL(file),
        alt: file.name,
      }));
      onImageUpload(newImages);
    }
  };

  return (
    <div className="mt-1">
        <label
          htmlFor="file-upload"
          className="relative cursor-pointer bg-white rounded-md font-medium text-brand-primary hover:text-brand-primary focus-within:outline-none flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed"
        >
          <div className="space-y-1 text-center">
            <PlusIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <span>Upload files</span>
              <input onChange={handleFileChange} id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" />
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF</p>
          </div>
        </label>
    </div>
  );
};

export default ImageUploader;
