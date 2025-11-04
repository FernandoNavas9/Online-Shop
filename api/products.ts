import { sql } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { category, subcategory } = req.query;

  try {
    let query = 'SELECT * FROM products';
    const params = [];
    
    if (category && category !== 'Todos') {
      query += ' WHERE category = $1';
      params.push(category as string);
      if (subcategory && subcategory !== 'Todos') {
        query += ' AND subcategory = $2';
        params.push(subcategory as string);
      }
    }
    
    query += ' ORDER BY created_at DESC';

    const { rows } = await sql.query(query, params);
    
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return res.status(500).json({ message: 'Error fetching products' });
  }
}
