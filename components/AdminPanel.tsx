import React, { useState } from 'react';
import { Product } from '../types';
import ProductForm from './ProductForm';
import ProductGrid from './ProductGrid';

const AdminPanel = () => {
  const [products, setProducts] = useState<Product[]>([]);
  
  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Product Management</h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <ProductForm onAddProduct={addProduct} />
      </div>
      <ProductGrid products={products} />
    </div>
  );
};

export default AdminPanel;
