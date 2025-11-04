import { put } from '@vercel/blob';
import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export const config = {
  api: {
    bodyParser: false, // Required for multipart/form-data
  },
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Vercel's edge environment doesn't support formidable or busboy directly
    // The request body needs to be handled as a stream
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const description = formData.get('description') as string | null;

    if (!file || !description) {
      return response.status(400).json({ error: 'File and description are required.' });
    }

    const blob = await put(file.name, file, {
      access: 'public',
    });

    const { rows } = await sql`
      INSERT INTO image_posts (image_url, description)
      VALUES (${blob.url}, ${description})
      RETURNING id, image_url, description, created_at;
    `;
    
    return response.status(201).json(rows[0]);

  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: 'Failed to upload image.' });
  }
}
