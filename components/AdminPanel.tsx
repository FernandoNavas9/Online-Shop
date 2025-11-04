import React, { useState, useEffect, useCallback } from 'react';
import ProductForm from './ProductForm';
import { ArrowLeft, LoaderCircle, PlusCircle } from 'lucide-react';
import { Product } from '../types';
import AdminProductList from './AdminProductList';

interface AdminPanelProps {
  onBackToStore: () => void;
  onProductAdded: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToStore, onProductAdded }) => {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductsForAdmin = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (view === 'list') {
      fetchProductsForAdmin();
    }
  }, [view, fetchProductsForAdmin]);
  
  const handleEdit = (product: Product) => {
    setProductToEdit(product);
    setView('form');
  };

  const handleAddNew = () => {
    setProductToEdit(null);
    setView('form');
  };

  const handleBackToList = () => {
    setView('list');
    setProductToEdit(null);
  };
  
  const handleProductDeleted = (deletedProductId: number) => {
     setProducts(prev => prev.filter(p => p.id !== deletedProductId));
  };

  const handleProductSaved = () => {
    onProductAdded();
  };


  return (
    <div className="p-6 md:p-10 bg-white flex-1 overflow-y-auto">
      <div className="flex items-center mb-6">
        <button onClick={onBackToStore} className="flex items-center text-gray-600 hover:text-brand-dark">
          <ArrowLeft size={20} className="mr-2" />
          Volver a la tienda
        </button>
      </div>
      <div className="max-w-7xl mx-auto">
        {view === 'list' && (
          <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-brand-dark">Gestionar Productos</h1>
                <button onClick={handleAddNew} className="flex items-center bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg transition-colors hover:bg-opacity-90">
                    <PlusCircle size={20} className="mr-2" />
                    Añadir Producto
                </button>
            </div>
            {isLoading && <div className="flex justify-center items-center h-64"><LoaderCircle className="w-12 h-12 animate-spin text-brand-primary" /></div>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {!isLoading && !error && <AdminProductList products={products} onEdit={handleEdit} onProductDeleted={handleProductDeleted} />}
          </>
        )}
        {view === 'form' && (
           <ProductForm
              productToEdit={productToEdit}
              onProductSaved={handleProductSaved}
              onCancel={handleBackToList}
            />
        )}
      </div>
    </div>
  );
};

export default AdminPanel;