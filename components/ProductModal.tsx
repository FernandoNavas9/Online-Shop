import React from 'react';
import { Product } from '../types';
import { XIcon } from './icons';
import { formatCurrency } from '../lib/utils';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 animate-fade-in-up">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          aria-label="Close product details"
        >
          <XIcon className="w-6 h-6" />
        </button>
        <div className="grid md:grid-cols-2 gap-6">
          <img
            src={product.images[0]?.url || 'https://placehold.co/600x600'}
            alt={product.images[0]?.alt || product.name}
            className="w-full h-full object-cover rounded-l-lg"
          />
          <div className="p-6 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-brand-dark mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-3xl font-light text-brand-primary mb-6">{formatCurrency(product.price)}</p>
            <button className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
