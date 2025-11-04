import React from 'react';
import { Product } from '../types';
import { formatCurrency } from '../lib/utils';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div 
      className="group cursor-pointer rounded-lg border bg-white text-gray-800 shadow-sm overflow-hidden transition-all hover:shadow-md hover:-translate-y-1"
      onClick={() => onClick(product)}
    >
      <div className="aspect-w-16 aspect-h-9 overflow-hidden">
        <img
          src={product.images[0]?.url || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={product.images[0]?.alt || product.name}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-500">{product.category}</p>
        <h3 className="text-lg font-semibold truncate mt-1">{product.name}</h3>
        <p className="text-xl font-bold text-indigo-600 mt-2">{formatCurrency(product.price)}</p>
      </div>
    </div>
  );
};

export default ProductCard;
