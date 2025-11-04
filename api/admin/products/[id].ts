import { sql } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';
import { Product } from '../../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  // Handle DELETE request
  if (req.method === 'DELETE') {
    try {
      const result = await sql`DELETE FROM products WHERE id = ${id} RETURNING *;`;
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Failed to delete product:', error);
      return res.status(500).json({ message: 'Error deleting product' });
    }
  }

  // Handle PUT request
  if (req.method === 'PUT') {
    try {
      const { 
          name, description, price, stock, category, subcategory, 
          color, brand, size, images 
      } = req.body as Omit<Product, 'id' | 'created_at'>;

      // Basic validation
      if (!name || !description || price === undefined || stock === undefined || !category || !subcategory) {
          return res.status(400).json({ message: 'Missing required fields' });
      }
      
      const result = await sql`
        UPDATE products
        SET 
          name = ${name}, 
          description = ${description}, 
          price = ${price}, 
          stock = ${stock}, 
          category = ${category}, 
          subcategory = ${subcategory}, 
          color = ${color}, 
          brand = ${brand}, 
          size = ${size}, 
          images = ${images}
        WHERE id = ${id}
        RETURNING *;
      `;

      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      return res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Failed to update product:', error);
      return res.status(500).json({ message: 'Error updating product' });
    }
  }

  // Method not allowed
  res.setHeader('Allow', ['DELETE', 'PUT']);
  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}
