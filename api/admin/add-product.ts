import { Product } from '../../types';

export async function addProduct(productData: Omit<Product, 'id'>): Promise<Product> {
  // Simulate adding a product with a delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newProduct: Product = {
    ...productData,
    id: `prod_${Date.now()}`,
    images: productData.images.map((img, index) => ({
      ...img,
      id: `img_${Date.now()}_${index}`
    })),
  };
  
  // In a real app, this would be sent to a server to be stored in a database.
  console.log('Mock added product:', newProduct);
  
  // For demonstration purposes, we are not persisting it. 
  // A full implementation would update the source of `getProducts`.
  return newProduct;
}
