import React from 'react';
import { Product } from '../types';
import { formatCurrency } from '../lib/utils';
import { cn } from '../lib/utils';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-transform transform hover:scale-105 group"
      onClick={() => onProductClick(product)}
    >
      <div className="aspect-square overflow-hidden">
        <img 
          src={product.images[0] || 'https://placehold.co/600x600/fef2f2/f8719d?text=Moda'} 
          alt={product.name} 
          className={cn(
              "w-full h-full object-cover transition-transform duration-300",
              product.images.length > 0 && "group-hover:scale-110"
          )}
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-brand-dark truncate">{product.name}</h3>
        <p className="text-gray-500 text-sm">{product.subcategory}</p>
        <p className="text-gray-800 font-semibold mt-2">{formatCurrency(product.price)}</p>
      </div>
    </div>
  );
};

export default ProductCard;
