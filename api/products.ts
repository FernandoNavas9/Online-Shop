import { Product } from '../types';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Cozy Knit Sweater',
    description: 'A warm and comfortable sweater, perfect for chilly days. Made from 100% recycled materials.',
    price: 79.99,
    images: [
      { id: 'img1', url: 'https://placehold.co/600x600/f8719d/white?text=Sweater', alt: 'Cozy Knit Sweater' },
    ],
  },
  {
    id: '2',
    name: 'Classic Denim Jeans',
    description: 'Timeless style meets modern comfort. These jeans are a wardrobe staple.',
    price: 120.00,
    images: [
      { id: 'img2', url: 'https://placehold.co/600x600/f8719d/white?text=Jeans', alt: 'Classic Denim Jeans' },
    ],
  },
  {
    id: '3',
    name: 'Leather Ankle Boots',
    description: 'Stylish and durable, these boots will elevate any outfit.',
    price: 150.50,
    images: [
      { id: 'img3', url: 'https://placehold.co/600x600/f8719d/white?text=Boots', alt: 'Leather Ankle Boots' },
    ],
  },
  {
    id: '4',
    name: 'Minimalist Wristwatch',
    description: 'A sleek and elegant timepiece for any occasion.',
    price: 250.00,
    images: [
      { id: 'img4', url: 'https://placehold.co/600x600/f8719d/white?text=Watch', alt: 'Minimalist Wristwatch' },
    ],
  },
];

export const getProducts = async (): Promise<Product[]> => {
  // Simulate API delay
  return new Promise(resolve => setTimeout(() => resolve(mockProducts), 500));
};
