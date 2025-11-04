export interface Image {
  id: string;
  url: string;
  alt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: Image[];
}
