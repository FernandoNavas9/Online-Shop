import { Product } from "../../types";

// This is a mock API file. In a real application, this would send product data to a server.
export async function addProduct(productData: Omit<Product, 'id'>): Promise<Product> {
  console.log("Adding product:", productData);
  // Simulate network delay and server-side ID generation
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newProduct: Product = {
    ...productData,
    id: self.crypto.randomUUID(),
  };
  
  return newProduct;
}
