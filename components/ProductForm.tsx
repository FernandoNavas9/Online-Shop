import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import ImageUploader from './ImageUploader';
import ImageList from './ImageList';
import { LoaderCircle } from 'lucide-react';

const categories = {
  'Bebé': ['Playera', 'Body', 'Pijama', 'Conjuntos', 'Pantalones', 'Accesorios'],
  'Niña': ['Vestidos', 'Blusas', 'Pantalones', 'Chamarras', 'Accesorios'],
  'Niño': ['Camisetas', 'Pantalones', 'Playeras', 'Chamarras', 'Accesorios'],
};
type Category = keyof typeof categories;

interface ProductFormProps {
  onProductAdded: () => void;
  onCancel: () => void;
  productToEdit?: Product | null;
}

const emptyProduct: Omit<Product, 'id' | 'created_at'> = {
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
};

const ProductForm: React.FC<ProductFormProps> = ({ onProductAdded, onCancel, productToEdit }) => {
  const [product, setProduct] = useState(emptyProduct);
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productToEdit) {
      setProduct({
        name: productToEdit.name,
        description: productToEdit.description,
        price: productToEdit.price,
        stock: productToEdit.stock,
        category: productToEdit.category,
        subcategory: productToEdit.subcategory,
        color: productToEdit.color || '',
        brand: productToEdit.brand || '',
        size: productToEdit.size || '',
        images: productToEdit.images,
      });
      setImages(productToEdit.images);
    } else {
      setProduct(emptyProduct);
      setImages([]);
    }
  }, [productToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: name === 'price' || name === 'stock' ? Number(value) : value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value as Category;
    setProduct(prev => ({
      ...prev,
      category: newCategory,
      subcategory: categories[newCategory][0] || '', // Reset subcategory
    }));
  };

  const handleImagesUploaded = (newImageUrls: string[]) => {
    setImages(prev => [...prev, ...newImageUrls]);
  };
  
  const handleRemoveImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const productData = {
        ...product,
        images,
        id: productToEdit?.id,
    };

    try {
      const response = await fetch('/api/admin/add-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save product');
      }

      onProductAdded();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-brand-dark mb-6">{productToEdit ? 'Editar Producto' : 'Añadir Nuevo Producto'}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name and Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                <input type="text" name="name" id="name" value={product.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
            </div>
            <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio (MXN)</label>
                <input type="number" name="price" id="price" value={product.price} onChange={handleChange} required min="0" step="0.01" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
            </div>
        </div>
        {/* Description */}
        <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea name="description" id="description" value={product.description} onChange={handleChange} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
        </div>

        {/* Category, Subcategory, Stock */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoría</label>
                <select id="category" name="category" value={product.category} onChange={handleCategoryChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                    {Object.keys(categories).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">Subcategoría</label>
                <select id="subcategory" name="subcategory" value={product.subcategory} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                    {(categories[product.category as Category] || []).map(subcat => <option key={subcat} value={subcat}>{subcat}</option>)}
                </select>
            </div>
             <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
                <input type="number" name="stock" id="stock" value={product.stock} onChange={handleChange} required min="0" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
            </div>
        </div>

        {/* Brand, Color, Size */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Marca (Opcional)</label>
                <input type="text" name="brand" id="brand" value={product.brand} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
            </div>
            <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color (Opcional)</label>
                <input type="text" name="color" id="color" value={product.color} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
            </div>
            <div>
                <label htmlFor="size" className="block text-sm font-medium text-gray-700">Talla (Opcional)</label>
                <input type="text" name="size" id="size" value={product.size} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
            </div>
        </div>
        
        {/* Image Uploader */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Imágenes</label>
            <p className="text-xs text-gray-500 mb-2">La primera imagen será la principal.</p>
            {images.length > 0 && <div className="mb-4"><ImageList images={images} onRemoveImage={handleRemoveImage}/></div>}
            <ImageUploader onImagesUploaded={handleImagesUploaded} />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        
        {/* Actions */}
        <div className="flex justify-end space-x-4">
            <button type="button" onClick={onCancel} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors">
                Cancelar
            </button>
            <button type="submit" disabled={isSubmitting || images.length === 0} className="bg-brand-primary hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center disabled:bg-opacity-50 disabled:cursor-not-allowed">
                {isSubmitting && <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />}
                {productToEdit ? 'Guardar Cambios' : 'Añadir Producto'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
