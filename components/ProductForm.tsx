import React, { useState, useCallback } from 'react';
// Fix: Import GoogleGenAI class from "@google/genai"
import { GoogleGenAI } from '@google/genai';
import { Image, Product } from '../types';
import ImageUploader from './ImageUploader';
import ImageList from './ImageList';
import { PlusIcon } from './icons';

interface ProductFormProps {
  onAddProduct: (product: Product) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onAddProduct }) => {
  const [images, setImages] = useState<Image[]>([]);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleUpload = useCallback((files: File[]) => {
    const newImages: Image[] = files.map(file => ({
      id: self.crypto.randomUUID(),
      url: URL.createObjectURL(file),
      alt: file.name,
      file,
    }));
    setImages(prev => [...prev, ...newImages]);
  }, []);

  const handleRemoveImage = useCallback((id: string) => {
    setImages(prev => prev.filter(image => image.id !== id));
  }, []);

  const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  };

  const generateDescription = async () => {
    if (!process.env.API_KEY) {
      alert("API_KEY environment variable not set.");
      return;
    }
    if (images.length === 0) {
      alert("Please upload at least one image.");
      return;
    }
    
    setIsGenerating(true);
    setProductDescription('');
    setProductName('');

    try {
      // Fix: Initialize GoogleGenAI with the API key in an object.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const imageParts = await Promise.all(
        images.map(image => fileToGenerativePart(image.file))
      );

      const prompt = "Based on these images, write a compelling product description for an e-commerce store. Also suggest a short, catchy product name. Format the response as:\nProduct Name: [Name]\n\nDescription: [Description]";
      
      // Fix: Use ai.models.generateContent and provide the model name.
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [...imageParts, { text: prompt }] },
      });

      // Fix: Directly access the 'text' property from the response.
      const text = response.text;
      const nameMatch = text.match(/Product Name: (.*)/);
      const descMatch = text.match(/Description: ([\s\S]*)/);
      
      if (nameMatch && nameMatch[1]) {
        setProductName(nameMatch[1].trim());
      }
      
      if (descMatch && descMatch[1]) {
        setProductDescription(descMatch[1].trim());
      } else {
        setProductDescription(text);
      }

    } catch (error) {
      console.error("Error generating description:", error);
      alert("Failed to generate description. Check the console for details.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !productDescription || images.length === 0 || !price) {
        alert("Please fill all fields, upload images, and set a price.");
        return;
    }
    const newProduct: Product = {
        id: self.crypto.randomUUID(),
        name: productName,
        description: productDescription,
        price: parseFloat(price),
        images: images,
    };
    onAddProduct(newProduct);
    
    setImages([]);
    setProductName('');
    setProductDescription('');
    setPrice('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="font-medium text-gray-700 mb-2">1. Upload Product Images</h3>
        <ImageUploader onUpload={handleUpload} />
      </div>

      {images.length > 0 && (
        <div className="animate-fade-in-up">
          <ImageList images={images} onRemoveImage={handleRemoveImage} />
        </div>
      )}

      <div>
         <h3 className="font-medium text-gray-700 mb-2">2. Generate Details with AI</h3>
         <button
          type="button"
          onClick={generateDescription}
          disabled={isGenerating || images.length === 0}
          className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
         >
          {isGenerating ? 'Generating...' : 'Generate Name & Description'}
         </button>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div>
          <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g. Classic Leather Tote Bag"
            required
          />
        </div>
        <div>
          <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
          <textarea
            id="productDescription"
            rows={6}
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g. A timeless and versatile tote bag..."
            required
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g. 99.99"
            required
            step="0.01"
          />
        </div>
      </div>
      
      <div className="pt-4">
        <button
          type="submit"
          disabled={!productName || !productDescription || images.length === 0 || !price}
          className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Add Product
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
