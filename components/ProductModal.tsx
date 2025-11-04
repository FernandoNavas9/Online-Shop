import React, { useState, useEffect } from 'react';
import { Product, Image } from '../types';
import { formatCurrency } from '../lib/utils';
import { XIcon } from './icons';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const [selectedImage, setSelectedImage] = useState<Image | undefined>(undefined);

  useEffect(() => {
    if (product?.images?.length) {
      setSelectedImage(product.images[0]);
    } else {
      setSelectedImage(undefined);
    }
  }, [product]);

  if (!product) return null;

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity" 
        onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row animate-fade-in-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Image Gallery */}
        <div className="w-full md:w-1/2 p-4">
            <div className="aspect-square mb-4 rounded-lg overflow-hidden">
                <img 
                    src={selectedImage?.url || 'https://via.placeholder.com/600?text=No+Image'} 
                    alt={selectedImage?.alt || product.name} 
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map(image => (
                    <button
                        type="button"
                        key={image.id} 
                        className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${selectedImage?.id === image.id ? 'border-indigo-500' : 'border-transparent hover:border-gray-300'}`}
                        onClick={() => setSelectedImage(image)}
                    >
                        <img 
                            src={image.url} 
                            alt={image.alt}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 p-6 flex flex-col">
          <div className="flex justify-between items-start">
            <div>
                <p className="text-indigo-600 font-semibold">{product.category}</p>
                <h2 className="text-3xl font-bold text-gray-900 mt-1">{product.name}</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 -mt-2 -mr-2">
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          
          <p className="text-3xl font-bold text-gray-800 my-4">{formatCurrency(product.price)}</p>
          <div className="text-gray-600 flex-grow prose">
            <p>{product.description}</p>
          </div>
          <button className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
