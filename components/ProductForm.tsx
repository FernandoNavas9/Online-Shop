
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import ImageUploader from './ImageUploader';
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

const ProductForm: React.FC<ProductFormProps> = ({ onProductAdded, onCancel, productToEdit }) => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'Bebé' as Category,
    subcategory: categories['Bebé'][0],
    color: '',
    brand: '',
    size: '',
    images: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (productToEdit) {
      setProduct({
        name: productToEdit.name,
        description: productToEdit.description,
        price: String(productToEdit.price),
        stock: String(productToEdit.stock),
        category: productToEdit.category,
        subcategory: productToEdit.subcategory,
        color: productToEdit.color || '',
        brand: productToEdit.brand || '',
        size: productToEdit.size || '',
        images: productToEdit.images || [],
      });
    }
  }, [productToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value as Category;
    setProduct(prev => ({
      ...prev,
      category: newCategory,
      subcategory: categories[newCategory][0],
    }));
  };
  
  const handleImagesChange = (newImages: string[]) => {
    setProduct(prev => ({ ...prev, images: newImages }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const productData = {
        ...product,
        price: parseFloat(product.price),
        stock: parseInt(product.stock, 10)
    };
    
    if (isNaN(productData.price) || isNaN(productData.stock)) {
        setError("Price and stock must be valid numbers.");
        setIsSubmitting(false);
        return;
    }

    try {
      const url = productToEdit ? `/api/admin/products/${productToEdit.id}` : '/api/admin/add-product';
      const method = productToEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
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
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow animate-fade-in-up">
        <h2 className="text-2xl font-bold text-brand-dark mb-6">{productToEdit ? 'Editar Producto' : 'Añadir Nuevo Producto'}</h2>
        <form onSubmit={handleSubmit}>
            {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Info */}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input type="text" name="name" id="name" value={product.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                        <textarea name="description" id="description" rows={4} value={product.description} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio</label>
                            <input type="number" step="0.01" name="price" id="price" value={product.price} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
                            <input type="number" name="stock" id="stock" value={product.stock} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoría</label>
                            <select name="category" id="category" value={product.category} onChange={handleCategoryChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                {Object.keys(categories).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">Subcategoría</label>
                            <select name="subcategory" id="subcategory" value={product.subcategory} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                {categories[product.category].map(sub => <option key={sub} value={sub}>{sub}</option>)}
                            </select>
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Marca (Opcional)</label>
                           <input type="text" name="brand" id="brand" value={product.brand} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                           <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color (Opcional)</label>
                           <input type="text" name="color" id="color" value={product.color} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="size" className="block text-sm font-medium text-gray-700">Talla (Opcional)</label>
                        <input type="text" name="size" id="size" value={product.size} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                    </div>
                </div>
                {/* Image Uploader */}
                <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Imágenes</label>
                     <ImageUploader initialImages={product.images} onImagesChange={handleImagesChange} />
                </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
                <button type="button" onClick={onCancel} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors">
                    Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className="bg-brand-primary hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center">
                    {isSubmitting && <LoaderCircle className="w-5 h-5 animate-spin mr-2" />}
                    {productToEdit ? 'Guardar Cambios' : 'Añadir Producto'}
                </button>
            </div>
        </form>
    </div>
  );
};

export default ProductForm;
