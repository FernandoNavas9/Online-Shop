import React from 'react';
import { Product } from '../types';
import { formatCurrency } from '../lib/utils';
import { Edit, Trash2, LoaderCircle } from 'lucide-react';

interface AdminProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => void;
  isLoading: boolean;
  error: string | null;
}

const AdminProductList: React.FC<AdminProductListProps> = ({ products, onEdit, onDelete, isLoading, error }) => {
  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow mt-8">
            <LoaderCircle className="w-12 h-12 animate-spin text-brand-primary" />
        </div>
    );
  }
  
  if (error) return <p className="text-red-500 bg-red-100 p-4 rounded-lg shadow mt-8">Error: {error}</p>;

  return (
    <div className="bg-white p-8 rounded-lg shadow mt-8">
      <h2 className="text-2xl font-bold text-brand-dark mb-6">Gestionar Productos</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No se encontraron productos.</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-md object-cover" src={product.images[0] || 'https://placehold.co/40x40/fef2f2/f8719d?text=Moda'} alt={product.name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.subcategory}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(product.price)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.stock > 10 ? 'bg-green-100 text-green-800' : 
                      product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-4">
                      <button onClick={() => onEdit(product)} className="text-indigo-600 hover:text-indigo-900" aria-label={`Edit ${product.name}`}>
                        <Edit size={18} />
                      </button>
                      <button onClick={() => onDelete(product.id)} className="text-red-600 hover:text-red-900" aria-label={`Delete ${product.name}`}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProductList;
