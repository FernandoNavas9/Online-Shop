import React from 'react';
import { Product } from '../types';
import { formatCurrency } from '../lib/utils';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      <img
        src={product.images[0]?.url || 'https://placehold.co/600x400'}
        alt={product.images[0]?.alt || product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg text-brand-dark truncate">{product.name}</h3>
        <p className="text-gray-600 mt-2 text-sm h-10 overflow-hidden text-ellipsis">{product.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="font-bold text-lg text-brand-primary">{formatCurrency(product.price)}</span>
          <button className="bg-brand-secondary text-brand-primary font-semibold px-3 py-1 text-sm rounded-full hover:bg-pink-100 transition-colors">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
