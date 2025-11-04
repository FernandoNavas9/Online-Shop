import React, { useState, FormEvent, useEffect } from 'react';
import { Product } from '../types';
import { GoogleGenAI } from '@google/genai';

interface ProductFormProps {
  onProductAdded: () => void;
  onCancel: () => void;
  productToEdit?: Product | null;
}

// A simple mock for image upload since the uploader component is missing.
// In a real app, this would handle file selection and upload to a service like Cloudinary or S3.
const ImageUploader = ({ images, setImages }: { images: string[], setImages: (images: string[]) => void }) => {
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleAddImage = () => {
    if (newImageUrl && !images.includes(newImageUrl)) {
      try {
        new URL(newImageUrl); // Validate URL
        setImages([...images, newImageUrl]);
        setNewImageUrl('');
      } catch (_) {
        alert('Please enter a valid URL.');
      }
    }
  };

  const handleRemoveImage = (url: string) => {
    setImages(images.filter(img => img !== url));
  };
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Imágenes (URLs)</label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <input
          type="url"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          placeholder="https://example.com/image.png"
          className="flex-1 block w-full rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        <button
          type="button"
          onClick={handleAddImage}
          className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500 hover:bg-gray-100"
        >
          Añadir
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {images.map(url => (
          <div key={url} className="relative">
            <img src={url} alt="product preview" className="h-20 w-20 rounded object-cover" />
            <button
              type="button"
              onClick={() => handleRemoveImage(url)}
              className="absolute -right-1 -top-1 rounded-full bg-red-500 p-0.5 text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};


const categories = {
  'Bebé': ['Playera', 'Body', 'Pijama', 'Conjuntos', 'Pantalones', 'Accesorios'],
  'Niña': ['Vestidos', 'Blusas', 'Pantalones', 'Chamarras', 'Accesorios'],
  'Niño': ['Camisetas', 'Pantalones', 'Playeras', 'Chamarras', 'Accesorios'],
};

type Category = keyof typeof categories;

const ProductForm: React.FC<ProductFormProps> = ({ onProductAdded, onCancel, productToEdit }) => {
  const [product, setProduct] = useState<Omit<Product, 'id' | 'created_at'>>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: 'Bebé',
    subcategory: 'Playera',
    color: '',
    brand: '',
    size: '',
    images: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setProduct(productToEdit);
    }
  }, [productToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: name === 'price' || name === 'stock' ? Number(value) : value }));
  };
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value as Category;
    setProduct(prev => ({
      ...prev,
      category: newCategory,
      subcategory: categories[newCategory][0] // Reset subcategory
    }));
  };
  
  const handleImageChange = (images: string[]) => {
    setProduct(prev => ({ ...prev, images }));
  };

  const generateDescription = async () => {
    if (!product.name) {
      alert('Por favor, introduce un nombre para el producto para generar una descripción.');
      return;
    }
    setIsGenerating(true);
    setError(null);
    try {
      // Fix: Use the correct constructor and API call as per the guidelines.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Generate a compelling and short product description in Spanish for a children's clothing item named "${product.name}". The category is "${product.category}" and subcategory is "${product.subcategory}". Mention it's comfortable and stylish. Keep it under 50 words.`
      });
      // Fix: Extract text directly from the response object.
      const text = response.text;
      setProduct(p => ({ ...p, description: text }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate description');
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const endpoint = productToEdit ? `/api/admin/products/${(productToEdit as Product).id}` : '/api/admin/add-product';
    const method = productToEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }

      onProductAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow animate-fade-in-up">
      <h2 className="text-2xl font-bold text-brand-dark">{productToEdit ? 'Editar Producto' : 'Añadir Nuevo Producto'}</h2>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded">{error}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
          <input type="text" name="name" id="name" value={product.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio</label>
          <input type="number" name="price" id="price" value={product.price} onChange={handleChange} required min="0" step="0.01" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea name="description" id="description" value={product.description} onChange={handleChange} rows={4} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          <button type="button" onClick={generateDescription} disabled={isGenerating || !product.name} className="mt-2 text-sm text-indigo-600 hover:text-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed">
            {isGenerating ? 'Generando...' : '✨ Generar con IA'}
          </button>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoría</label>
          <select name="category" id="category" value={product.category} onChange={handleCategoryChange} required className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
            {Object.keys(categories).map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {/* Subcategory */}
        <div>
          <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">Subcategoría</label>
          <select name="subcategory" id="subcategory" value={product.subcategory} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
            {categories[product.category as keyof typeof categories].map(sub => <option key={sub} value={sub}>{sub}</option>)}
          </select>
        </div>
        
        {/* Stock */}
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
          <input type="number" name="stock" id="stock" value={product.stock} onChange={handleChange} required min="0" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>

        {/* Size */}
        <div>
          <label htmlFor="size" className="block text-sm font-medium text-gray-700">Talla</label>
          <input type="text" name="size" id="size" value={product.size || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>

        {/* Color */}
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color</label>
          <input type="text" name="color" id="color" value={product.color || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>

        {/* Brand */}
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Marca</label>
          <input type="text" name="brand" id="brand" value={product.brand || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>

        {/* Images */}
        <div className="md:col-span-2">
            <ImageUploader images={product.images} setImages={handleImageChange} />
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <button type="button" onClick={onCancel} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Cancelar
        </button>
        <button type="submit" disabled={isSubmitting} className="inline-flex justify-center rounded-md border border-transparent bg-brand-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 disabled:opacity-50">
          {isSubmitting ? 'Guardando...' : (productToEdit ? 'Guardar Cambios' : 'Añadir Producto')}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
