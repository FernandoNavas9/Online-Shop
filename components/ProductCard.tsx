import React from 'react';
import { Product } from '../types';
import { formatCurrency } from '../lib/utils';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform transform hover:scale-105"
      onClick={() => onProductClick(product)}
    >
      <img 
        src={product.images[0]?.url || 'https://placehold.co/600x600'} 
        alt={product.images[0]?.alt || product.name} 
        className="w-full h-56 object-cover" 
      />
      <div className="p-4">
        <h3 className="font-bold text-lg text-brand-dark">{product.name}</h3>
        <p className="text-gray-600 mt-2">{formatCurrency(product.price)}</p>
      </div>
    </div>
  );
};

export default ProductCard;
