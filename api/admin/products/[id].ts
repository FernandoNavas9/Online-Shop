
import { sql } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';
import { Product } from '../../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  const productId = parseInt(id, 10);
  if (isNaN(productId)) {
    return res.status(400).json({ message: 'Product ID must be a number' });
  }

  if (req.method === 'PUT') {
    // Handle Update
    try {
        const { 
            name, description, price, stock, category, subcategory, 
            color, brand, size, images 
        } = req.body as Partial<Omit<Product, 'id' | 'created_at'>>;
        
        if (!name || !description || price === undefined || stock === undefined || !category || !subcategory) {
            return res.status(400).json({ message: 'Missing required product fields.' });
        }

        const { rows } = await sql`
            UPDATE products
            SET 
                name = ${name},
                description = ${description},
                price = ${price},
                stock = ${stock},
                category = ${category},
                subcategory = ${subcategory},
                color = ${color || null},
                brand = ${brand || null},
                size = ${size || null},
                images = ${JSON.stringify(images || [])}
            WHERE id = ${productId}
            RETURNING *;
        `;

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        return res.status(200).json(rows[0]);
    } catch (error) {
        console.error(`Failed to update product ${productId}:`, error);
        return res.status(500).json({ message: `Error updating product ${productId}` });
    }
  } else if (req.method === 'DELETE') {
    // Handle Delete
    try {
        const { rowCount } = await sql`
            DELETE FROM products
            WHERE id = ${productId};
        `;
        
        if (rowCount === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json({ message: `Product ${productId} deleted successfully.` });
    } catch (error) {
        console.error(`Failed to delete product ${productId}:`, error);
        return res.status(500).json({ message: `Error deleting product ${productId}` });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
