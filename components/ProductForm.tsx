import React, { useState } from 'react';
import { Product, Image } from '../types';
import { addProduct as apiAddProduct } from '../api/admin/add-product';
import ImageUploader from './ImageUploader';
import ImageList from './ImageList';

interface ProductFormProps {
  onProductAdd: (product: Product) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onProductAdd }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState<Image[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || images.length === 0) {
      setError('Name, price, and at least one image are required.');
      return;
    }
    setError(null);
    setIsSubmitting(true);

    const newProduct: Omit<Product, 'id'> = {
      name,
      description,
      price: parseFloat(price),
      images,
    };

    try {
      const addedProduct = await apiAddProduct(newProduct);
      onProductAdd(addedProduct);
    } catch (err) {
      setError('Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (newImages: Image[]) => {
    setImages(prevImages => [...prevImages, ...newImages]);
  };
  
  const handleRemoveImage = (id: string) => {
    setImages(prevImages => prevImages.filter(image => image.id !== id));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
        <input type="number" id="price" value={price} onChange={e => setPrice(e.target.value)} required step="0.01" min="0" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Images</label>
        <ImageUploader onImageUpload={handleImageUpload} />
        <ImageList images={images} onRemoveImage={handleRemoveImage} />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button type="submit" disabled={isSubmitting} className="w-full bg-brand-primary text-white py-2 px-4 rounded-md hover:bg-opacity-90 disabled:bg-gray-400">
        {isSubmitting ? 'Adding...' : 'Add Product'}
      </button>
    </form>
  );
};

export default ProductForm;
