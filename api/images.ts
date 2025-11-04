import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { rows } = await sql`
      SELECT id, image_url, description, created_at 
      FROM image_posts 
      ORDER BY created_at DESC;
    `;
    return response.status(200).json(rows);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: 'Failed to fetch images.' });
  }
}
