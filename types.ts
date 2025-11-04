export interface Image {
  id: string;
  url: string;
  alt: string;
  file: File;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: Image[];
}
