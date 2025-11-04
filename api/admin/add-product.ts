
import { sql } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';
import { Product } from '../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { 
        name, description, price, stock, category, subcategory, 
        color, brand, size, images 
    } = req.body as Partial<Omit<Product, 'id' | 'created_at'>>;

    // Basic validation
    if (!name || !description || price === undefined || stock === undefined || !category || !subcategory) {
        return res.status(400).json({ message: 'Missing required product fields.' });
    }

    const { rows } = await sql`
      INSERT INTO products (name, description, price, stock, category, subcategory, color, brand, size, images)
      VALUES (${name}, ${description}, ${price}, ${stock}, ${category}, ${subcategory}, ${color || null}, ${brand || null}, ${size || null}, ${JSON.stringify(images || [])})
      RETURNING *;
    `;

    return res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Failed to add product:', error);
    return res.status(500).json({ message: 'Error adding product' });
  }
}
