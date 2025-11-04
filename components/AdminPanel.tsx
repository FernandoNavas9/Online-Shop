import React, { useState } from 'react';
import { addProduct } from '../api/admin/add-product';
import ProductForm from './ProductForm';
import { Product } from '../types';
import { PlusIcon } from './icons';

interface AdminPanelProps {
  onProductAdded: (newProduct: Product) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onProductAdded }) => {
  const [showForm, setShowForm] = useState(false);

  const handleAddProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const newProduct = await addProduct(productData);
      setShowForm(false);
      onProductAdded(newProduct);
      // In a real app, you might show a success toast notification
      alert('Product added successfully!');
    } catch (error) {
      console.error('Failed to add product', error);
      alert('Failed to add product.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Admin Panel</h2>
        {!showForm && (
            <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
            <PlusIcon className="w-5 h-5" />
            Add New Product
            </button>
        )}
      </div>
      {showForm && (
        <div className="mt-4">
            <ProductForm 
                onSubmit={handleAddProduct}
                onCancel={() => setShowForm(false)}
            />
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
