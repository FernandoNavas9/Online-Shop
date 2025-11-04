import React from 'react';
import ProductForm from './ProductForm';
import { Product } from '../types';
import { XIcon } from './icons';

interface AdminPanelProps {
  closePanel: () => void;
  onProductAdd: (product: Product) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ closePanel, onProductAdd }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-lg p-6 overflow-y-auto animate-fade-in-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-brand-dark">Add New Product</h2>
          <button onClick={closePanel} className="text-gray-500 hover:text-gray-800">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <ProductForm onProductAdd={onProductAdd} />
      </div>
    </div>
  );
};

export default AdminPanel;
