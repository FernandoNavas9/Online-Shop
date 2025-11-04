import React, { useState, ChangeEvent } from 'react';
import { X, UploadCloud } from 'lucide-react';

interface ProductFormProps {
  onProductAdded: () => void;
}

const categories = {
  'Bebé': ['Playera', 'Body', 'Pijama', 'Conjuntos', 'Pantalones', 'Accesorios'],
  'Niña': ['Vestidos', 'Blusas', 'Pantalones', 'Chamarras', 'Accesorios'],
  'Niño': ['Camisetas', 'Pantalones', 'Playeras', 'Chamarras', 'Accesorios'],
};

type Category = keyof typeof categories;

const ProductForm: React.FC<ProductFormProps> = ({ onProductAdded }) => {
  const [formState, setFormState] = useState({
    name: '', description: '', price: '', stock: '', 
    category: 'Bebé' as Category, subcategory: categories['Bebé'][0],
    color: '', brand: '', size: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const newImages = [...images, ...files];
      setImages(newImages);
      // FIX: The `file` was being inferred as `unknown`. Casting to `Blob` resolves the typing issue
      // for `URL.createObjectURL` which expects a Blob or MediaSource.
      const newPreviews = files.map(file => URL.createObjectURL(file as Blob));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };
  
  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.price || !formState.stock || images.length === 0) {
      setError('Nombre, precio, stock y al menos una imagen son requeridos.');
      return;
    }
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData();
    Object.entries(formState).forEach(([key, value]) => {
      // FIX: The `value` from `Object.entries(formState)` was inferred as `unknown`.
      // Since all values in formState are strings, we can safely cast it to `string`
      // to satisfy the `formData.append` method signature.
      formData.append(key, value as string);
    });
    images.forEach(image => {
      formData.append('images', image);
    });

    try {
      const response = await fetch('/api/admin/add-product', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to add product');
      }
      
      onProductAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <button type="submit" disabled={isSubmitting} className="w-full bg-brand-primary text-white py-2.5 px-4 rounded-md hover:bg-opacity-90 disabled:bg-gray-400 font-semibold">
        {isSubmitting ? 'Añadiendo...' : 'Añadir Producto'}
      </button>
    </form>
  );
};

export default ProductForm;
