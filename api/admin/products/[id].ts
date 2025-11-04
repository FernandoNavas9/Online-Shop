import { sql } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  const productId = parseInt(id, 10);
  if (isNaN(productId)) {
    return res.status(400).json({ message: 'Product ID must be a number' });
  }

  if (req.method === 'DELETE') {
    try {
      const result = await sql`
        DELETE FROM products
        WHERE id = ${productId};
      `;

      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }

      return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Failed to delete product:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return res.status(500).json({ message: 'Error deleting product', error: errorMessage });
    }
  }

  // You could add GET, PUT, PATCH handlers here if needed
  
  return res.status(405).json({ message: 'Method Not Allowed' });
}
