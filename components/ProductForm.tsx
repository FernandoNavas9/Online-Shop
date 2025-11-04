import React, { useState, ChangeEvent, useEffect } from 'react';
import { X, UploadCloud } from 'lucide-react';
import { Product } from '../types';

interface ProductFormProps {
  productToEdit?: Product | null;
  onProductSaved: () => void;
  onCancel: () => void;
}

const categories = {
  'Bebé': ['Playera', 'Body', 'Pijama', 'Conjuntos', 'Pantalones', 'Accesorios'],
  'Niña': ['Vestidos', 'Blusas', 'Pantalones', 'Chamarras', 'Accesorios'],
  'Niño': ['Camisetas', 'Pantalones', 'Playeras', 'Chamarras', 'Accesorios'],
};

type Category = keyof typeof categories;

const ProductForm: React.FC<ProductFormProps> = ({ productToEdit, onProductSaved, onCancel }) => {
  const isEditing = !!productToEdit;
  const [formState, setFormState] = useState({
    name: '', description: '', price: '', stock: '', 
    category: 'Bebé' as Category, subcategory: categories['Bebé'][0],
    color: '', brand: '', size: '',
  });
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing) {
      setFormState({
        name: productToEdit.name,
        description: productToEdit.description,
        price: String(productToEdit.price),
        stock: String(productToEdit.stock),
        category: productToEdit.category,
        subcategory: productToEdit.subcategory,
        color: productToEdit.color || '',
        brand: productToEdit.brand || '',
        size: productToEdit.size || '',
      });
      setExistingImages(productToEdit.images);
      setImagePreviews(productToEdit.images);
    }
  }, [productToEdit, isEditing]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    if (name === 'category') {
      setFormState(prev => ({ ...prev, subcategory: categories[value as Category][0] }));
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImages(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file as Blob));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };
  
  const handleRemoveImage = (index: number) => {
    const imageToRemove = imagePreviews[index];
    const isExisting = existingImages.includes(imageToRemove);
    
    setImagePreviews(prev => prev.filter((_, i) => i !== index));

    if (isExisting) {
      setExistingImages(prev => prev.filter(url => url !== imageToRemove));
    } else {
      // It's a new image, find its corresponding File object and remove it
      URL.revokeObjectURL(imageToRemove); // Clean up memory
      const fileIndexToRemove = imagePreviews.slice(0, index).filter(p => !existingImages.includes(p)).length;
      setNewImages(prev => prev.filter((_, i) => i !== fileIndexToRemove));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.price || !formState.stock || imagePreviews.length === 0) {
      setError('Nombre, precio, stock y al menos una imagen son requeridos.');
      return;
    }
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData();
    Object.entries(formState).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    newImages.forEach(image => formData.append('images', image));
    
    if (isEditing) {
      formData.append('existingImages', existingImages.join(','));
    }

    try {
      const url = isEditing ? `/api/admin/products/${productToEdit.id}` : '/api/admin/add-product';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, { method, body: formData });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to save product');
      }
      
      onProductSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-brand-dark mb-4">{isEditing ? 'Editar Producto' : 'Añadir Nuevo Producto'}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form fields are the same as before... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                <input type="text" name="name" id="name" value={formState.name} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Marca</label>
                <input type="text" name="brand" id="brand" value={formState.brand} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea name="description" id="description" value={formState.description} onChange={handleInputChange} rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio</label>
                <input type="number" name="price" id="price" value={formState.price} onChange={handleInputChange} required step="0.01" min="0" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
                <input type="number" name="stock" id="stock" value={formState.stock} onChange={handleInputChange} required min="0" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color</label>
                <input type="text" name="color" id="color" value={formState.color} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label htmlFor="size" className="block text-sm font-medium text-gray-700">Talla</label>
                <input type="text" name="size" id="size" value={formState.size} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoría</label>
                <select name="category" id="category" value={formState.category} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                  {Object.keys(categories).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">Subcategoría</label>
                <select name="subcategory" id="subcategory" value={formState.subcategory} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                  {categories[formState.category].map(sub => <option key={sub} value={sub}>{sub}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Imágenes</label>
              <div className="mt-1">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-primary hover:text-brand-primary focus-within:outline-none flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed">
                    <div className="space-y-1 text-center">
                      <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <span>Sube los archivos</span>
                        <input onChange={handleImageChange} id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" />
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF</p>
                    </div>
                  </label>
              </div>
              {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {imagePreviews.map((src, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover rounded-lg" />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 rounded-lg" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                        aria-label="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-end space-x-4">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 py-2.5 px-4 rounded-md hover:bg-gray-300 font-semibold">
                    Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className="bg-brand-primary text-white py-2.5 px-4 rounded-md hover:bg-opacity-90 disabled:bg-gray-400 font-semibold">
                    {isSubmitting ? (isEditing ? 'Actualizando...' : 'Añadiendo...') : (isEditing ? 'Actualizar Producto' : 'Añadir Producto')}
                </button>
            </div>
        </form>
    </div>
  );
};

export default ProductForm;