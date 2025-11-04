import React, { useState } from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import { LoaderCircle } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading, error }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-64">
            <LoaderCircle className="w-12 h-12 animate-spin text-brand-primary" />
        </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }
  
  if (products.length === 0) {
    return <p className="text-gray-500 text-center mt-10">No se encontraron productos en esta categoría.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} onProductClick={setSelectedProduct} />
        ))}
      </div>
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </>
  );
};

export default ProductGrid;
