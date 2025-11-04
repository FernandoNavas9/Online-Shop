import { Image } from '../types';

// This is just mock data. In a real application, you would fetch this from an API.
const mockImages: Image[] = [
    { id: 'img_unsplash_1', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop', alt: 'Headphones on a yellow background' },
    { id: 'img_unsplash_2', url: 'https://images.unsplash.com/photo-1546435770-a3e426bf4022?q=80&w=1000&auto=format&fit=crop', alt: 'Side view of the headphones' },
    { id: 'img_unsplash_3', url: 'https://images.unsplash.com/photo-1553062407-98eeb68c6a62?q=80&w=1000&auto=format&fit=crop', alt: 'Brown leather backpack' },
    { id: 'img_unsplash_4', url: 'https://images.unsplash.com/photo-1518444065439-e933c06ce9ce?q=80&w=1000&auto=format&fit=crop', alt: 'Smart home device' },
    { id: 'img_unsplash_5', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop', alt: 'Man wearing a white t-shirt' },
];

export async function getImages(): Promise<Image[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockImages;
}
