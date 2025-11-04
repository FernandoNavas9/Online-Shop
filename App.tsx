
import React, { useState, useCallback } from 'react';
import ImageUploader from './components/ImageUploader';
import ImageList from './components/ImageList';
import { ImagePost } from './types';

function App() {
  const [images, setImages] = useState<ImagePost[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveImage = useCallback(async (data: { file: File; description: string }) => {
    setIsLoading(true);

    // --- Backend Integration Point ---
    // In a real application, you would replace this timeout with an API call.
    // 1. Upload the file to a storage service (like Vercel Blob, S3, etc.).
    //    You'll get a URL for the stored image.
    // 2. Send the image URL and description to a Vercel Serverless Function.
    // 3. The function would then insert a new record into your Neon (Postgres) database.
    //
    // Example:
    // const formData = new FormData();
    // formData.append('image', data.file);
    // formData.append('description', data.description);
    // const response = await fetch('/api/upload', { method: 'POST', body: formData });
    // const newImagePost = await response.json();
    // if (response.ok) {
    //   setImages(prev => [newImagePost, ...prev]);
    // } else {
    //   // Handle error
    // }
    
    // Simulating API call for demonstration purposes
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newImage: ImagePost = {
      id: new Date().toISOString(),
      imageUrl: URL.createObjectURL(data.file),
      description: data.description,
      file: data.file, // Note: In a real app, you wouldn't store the file object in state long-term
    };

    setImages(prevImages => [newImage, ...prevImages]);
    setIsLoading(false);
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1 lg:sticky lg:top-24">
                <ImageUploader onImageSave={handleSaveImage} isLoading={isLoading} />
            </div>
            <div className="lg:col-span-2">
                <ImageList images={images} />
            </div>
        </div>
      </main>
    </div>
  );
}

export default App;
