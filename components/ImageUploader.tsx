
import React, { useState, useCallback, ChangeEvent, FormEvent } from 'react';
import { UploadIcon, SpinnerIcon } from './icons';

interface ImageUploaderProps {
  onImageSave: (data: { file: File; description: string }) => Promise<void>;
  isLoading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSave, isLoading }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        setFile(null);
        setPreviewUrl(null);
        return;
      }
      setError(null);
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setError('Please select an image to upload.');
      return;
    }
    if (!description.trim()) {
        setError('Please enter a description for the image.');
        return;
    }
    setError(null);
    await onImageSave({ file, description });
    
    // Reset form after successful submission
    setFile(null);
    setPreviewUrl(null);
    setDescription('');
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if(fileInput) fileInput.value = '';

  };

  return (
    <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Upload New Image</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
            Image File
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="mx-auto h-32 w-auto object-contain rounded-md" />
              ) : (
                <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
              )}
              <div className="flex text-sm text-slate-600 dark:text-slate-400">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white dark:bg-slate-800 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>{file ? 'Change file' : 'Upload a file'}</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*"/>
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-600 dark:text-slate-300">
            Description
          </label>
          <div className="mt-1">
            <textarea
              id="description"
              name="description"
              rows={4}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              placeholder="A beautiful landscape with mountains..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <div>
          <button
            type="submit"
            disabled={isLoading || !file || !description}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed dark:focus:ring-offset-slate-900"
          >
            {isLoading ? (
                <>
                    <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Saving...
                </>
            ) : 'Save to Gallery'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ImageUploader;
