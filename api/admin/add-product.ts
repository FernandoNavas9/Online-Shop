import { Product } from '../../types';

export const addProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
  // Simulate API call to add a product
  console.log('Adding product:', productData);
  const newProduct: Product = {
    ...productData,
    id: new Date().getTime().toString(), // Generate a unique ID
  };
  return new Promise(resolve => setTimeout(() => resolve(newProduct), 500));
};
