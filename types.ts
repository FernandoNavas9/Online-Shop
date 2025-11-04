export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: 'Bebé' | 'Niña' | 'Niño';
  subcategory: string;
  color?: string;
  brand?: string;
  size?: string;
  images: string[];
  created_at: string;
}
