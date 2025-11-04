import { sql } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';
import { Product } from '../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { id, name, description, price, stock, category, subcategory, color, brand, size, images } = req.body as Partial<Product>;

    // Basic validation
    if (!name || !price || !stock || !category || !subcategory || !images || images.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let result;
    if (id) {
      // Update existing product
      result = await sql`
        UPDATE products
        SET name = ${name}, description = ${description}, price = ${price}, stock = ${stock}, category = ${category}, subcategory = ${subcategory}, color = ${color}, brand = ${brand}, size = ${size}, images = ${JSON.stringify(images)}::jsonb
        WHERE id = ${id}
        RETURNING *;
      `;
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
    } else {
      // Create new product
      result = await sql`
        INSERT INTO products (name, description, price, stock, category, subcategory, color, brand, size, images)
        VALUES (${name}, ${description}, ${price}, ${stock}, ${category}, ${subcategory}, ${color}, ${brand}, ${size}, ${JSON.stringify(images)}::jsonb)
        RETURNING *;
      `;
    }

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Failed to add/update product:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({ message: 'Error adding/updating product', error: errorMessage });
  }
}
