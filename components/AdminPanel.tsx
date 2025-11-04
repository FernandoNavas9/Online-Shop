import React from 'react';
import ProductForm from './ProductForm';
import { ArrowLeft } from 'lucide-react';

interface AdminPanelProps {
  onBackToStore: () => void;
  onProductAdded: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToStore, onProductAdded }) => {
  return (
    <div className="p-6 md:p-10 bg-white flex-1 overflow-y-auto">
        <div className="flex items-center mb-6">
            <button onClick={onBackToStore} className="flex items-center text-gray-600 hover:text-brand-dark">
                <ArrowLeft size={20} className="mr-2"/>
                Volver a la tienda
            </button>
        </div>
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-brand-dark mb-6">Panel de Administrador</h1>
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-brand-dark mb-4">Añadir Nuevo Producto</h2>
                <ProductForm onProductAdded={onProductAdded} />
            </div>
        </div>
    </div>
  );
};

export default AdminPanel;
