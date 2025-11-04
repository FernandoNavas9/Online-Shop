import React, { useState, MouseEvent } from 'react';
import { Product } from '../types';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { cn } from '../lib/utils';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [zoomCoords, setZoomCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomCoords({ x, y });
  };
  
  const nextImage = () => setActiveImageIndex((prev) => (prev + 1) % product.images.length);
  const prevImage = () => setActiveImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in-up" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full relative" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-800 z-20 bg-white rounded-full p-1"
          aria-label="Close product details"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-square">
            <div 
              className="absolute inset-0 overflow-hidden rounded-l-lg"
              onMouseMove={handleMouseMove}
            >
              <img
                src={product.images[activeImageIndex]}
                alt={`${product.name} image ${activeImageIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-300"
                style={{ transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`, transform: 'scale(1.5)' }}
              />
            </div>
             {product.images.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1 hover:bg-white transition"><ChevronLeft/></button>
                <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1 hover:bg-white transition"><ChevronRight/></button>
              </>
            )}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
                {product.images.map((_, index) => (
                    <button key={index} onClick={() => setActiveImageIndex(index)} className={cn("w-2 h-2 rounded-full", activeImageIndex === index ? "bg-brand-primary" : "bg-white/80")}></button>
                ))}
            </div>
          </div>
          <div className="p-8 flex flex-col">
            <h2 className="text-3xl font-bold text-brand-dark mb-2">{product.name}</h2>
            <p className="text-gray-500 mb-4">{product.category} &gt; {product.subcategory}</p>
            <p className="text-gray-700 mb-6 flex-grow">{product.description}</p>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-6">
                {product.brand && <div><span className="font-semibold">Marca:</span> {product.brand}</div>}
                {product.color && <div><span className="font-semibold">Color:</span> {product.color}</div>}
                {product.size && <div><span className="font-semibold">Talla:</span> {product.size}</div>}
                <div><span className="font-semibold">Disponibles:</span> {product.stock}</div>
            </div>

            <p className="text-4xl font-light text-brand-primary mb-6">{formatCurrency(product.price)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;