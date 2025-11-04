import React, { useState, useCallback, useEffect } from 'react';
import ImageUploader from './components/ImageUploader';
import ImageList from './components/ImageList';
import { ImagePost } from './types';
import { SpinnerIcon } from './components/icons';

function App() {
  const [images, setImages] = useState<ImagePost[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setError(null);
        setIsFetching(true);
        const response = await fetch('/api/images');
        if (!response.ok) {
          throw new Error('Failed to fetch images.');
        }
        const data = await response.json();
        setImages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsFetching(false);
      }
    };
    fetchImages();
  }, []);

  const handleSaveImage = useCallback(async (data: { file: File; description: string }) => {
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('description', data.description);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image.');
      }
      
      const newImagePost = await response.json();
      setImages(prev => [newImagePost, ...prev]);

    } catch (err) {
       setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsUploading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <header className="bg-white dark:bg-slate-800/50 backdrop-blur-sm shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Image Gallery</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Powered by Vercel & Neon</p>
            </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1 lg:sticky lg:top-24">
                <ImageUploader onImageSave={handleSaveImage} isLoading={isUploading} />
            </div>
            <div className="lg:col-span-2">
              {isFetching ? (
                <div className="flex justify-center items-center h-64">
                    <SpinnerIcon className="animate-spin h-12 w-12 text-indigo-500" />
                </div>
              ) : (
                <ImageList images={images} />
              )}
            </div>
        </div>
      </main>
    </div>
  );
}

export default App;
