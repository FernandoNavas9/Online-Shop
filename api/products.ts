import { Product } from '../types';

// This is just mock data. In a real application, you would fetch this from an API.
const mockProducts: Product[] = [
  {
    id: 'prod_1',
    name: 'Wireless Bluetooth Headphones',
    description: 'High-fidelity wireless headphones with noise-cancellation and a 20-hour battery life. Perfect for music lovers and frequent travelers.',
    price: 149.99,
    category: 'Electronics',
    images: [
      { id: 'img_1', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop', alt: 'Headphones on a yellow background' },
      { id: 'img_2', url: 'https://images.unsplash.com/photo-1546435770-a3e426bf4022?q=80&w=1000&auto=format&fit=crop', alt: 'Side view of the headphones' },
    ],
  },
  {
    id: 'prod_2',
    name: 'Modern Leather Backpack',
    description: 'A stylish and durable leather backpack with multiple compartments, including a padded laptop sleeve. Ideal for work or daily use.',
    price: 89.50,
    category: 'Apparel',
    images: [
      { id: 'img_3', url: 'https://images.unsplash.com/photo-1553062407-98eeb68c6a62?q=80&w=1000&auto=format&fit=crop', alt: 'Brown leather backpack' },
    ],
  },
  {
    id: 'prod_3',
    name: 'Smart Home Hub',
    description: 'Control all your smart devices from one central hub. Compatible with Alexa, Google Assistant, and Apple HomeKit.',
    price: 99.00,
    category: 'Electronics',
    images: [
      { id: 'img_4', url: 'https://images.unsplash.com/photo-1518444065439-e933c06ce9ce?q=80&w=1000&auto=format&fit=crop', alt: 'Smart home device' },
    ],
  },
  {
    id: 'prod_4',
    name: 'Organic Cotton T-Shirt',
    description: 'A soft, breathable t-shirt made from 100% organic cotton. Available in various colors and sizes.',
    price: 25.00,
    category: 'Apparel',
    images: [
      { id: 'img_5', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop', alt: 'Man wearing a white t-shirt' },
    ],
  },
  {
    id: 'prod_5',
    name: 'Stainless Steel Water Bottle',
    description: 'Keep your drinks cold for 24 hours or hot for 12. This insulated water bottle is BPA-free and has a leak-proof design.',
    price: 32.00,
    category: 'Home Goods',
    images: [
      { id: 'img_6', url: 'https://images.unsplash.com/photo-1602143407151-247e961d21a6?q=80&w=1000&auto=format&fit=crop', alt: 'Stainless steel water bottle' },
    ],
  },
  {
    id: 'prod_6',
    name: 'The Alchemist by Paulo Coelho',
    description: 'A classic novel that has inspired millions. Follow the journey of Santiago, an Andalusian shepherd boy.',
    price: 15.99,
    category: 'Books',
    images: [
      { id: 'img_7', url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop', alt: 'A stack of books' },
    ],
  },
];


export async function getProducts(): Promise<Product[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockProducts;
}

export async function getProduct(id: string): Promise<Product | undefined> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockProducts.find(p => p.id === id);
}
