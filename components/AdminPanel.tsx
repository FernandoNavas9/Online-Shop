import React, { useState, useEffect, useCallback } from 'react';
import ProductForm from './ProductForm';
import AdminProductList from './AdminProductList';
import { Product } from '../types';
import { Plus } from 'lucide-react';

interface AdminPanelProps {
  onBackToStore: () => void;
  onProductAdded: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToStore, onProductAdded }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/products?category=Todos'); // Fetch all products
      if (!response.ok) {
        throw new Error('Failed to fetch products for admin panel');
      }
      const data: Product[] = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleProductAdded = () => {
    setShowForm(false);
    setProductToEdit(null);
    fetchProducts(); // Refresh the list
    onProductAdded(); // Propagate event to App.tsx
  };

  const handleEdit = (product: Product) => {
    setProductToEdit(product);
    setShowForm(true);
  };
  
  const handleAddNew = () => {
    setProductToEdit(null);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setProductToEdit(null);
  };
  
  const handleDelete = async (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
        try {
            const response = await fetch(`/api/admin/products/${productId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete product');
            }
            fetchProducts(); // Refresh the list
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setError(errorMessage);
            alert(`Error: ${errorMessage}`);
        }
    }
  };


  return (
    <div className="flex-1 p-6 md:p-10 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-brand-dark">Admin Panel</h1>
        <div>
            <button
                onClick={onBackToStore}
                className="mr-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors"
            >
                Volver a la tienda
            </button>
            {!showForm && (
                <button
                    onClick={handleAddNew}
                    className="bg-brand-primary hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
                >
                    <Plus size={18} />
                    <span>Añadir Producto</span>
                </button>
            )}
        </div>
      </div>
      <hr className="border-brand-primary mb-6" />

      {showForm ? (
        <ProductForm 
            onProductAdded={handleProductAdded}
            onCancel={handleCancelForm}
            productToEdit={productToEdit}
        />
      ) : (
        <AdminProductList
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
          error={error}
        />
      )}
    </div>
  );
};

export default AdminPanel;
