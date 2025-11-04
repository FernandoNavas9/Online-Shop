
import { put } from '@vercel/blob';
import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = (req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
    const form = formidable({});
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            resolve({ fields, files });
        });
    });
};


export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { fields, files } = await parseForm(request);

    const descriptionField = fields.description;
    const description = Array.isArray(descriptionField) ? descriptionField[0] : descriptionField;
    
    const fileField = files.file;
    const file = Array.isArray(fileField) ? fileField[0] : fileField;

    if (!file || !description) {
      return response.status(400).json({ error: 'File and description are required.' });
    }

    const fileContent = fs.readFileSync(file.filepath);

    const blob = await put(file.originalFilename || 'unknown-file', fileContent, {
      access: 'public',
      contentType: file.mimetype || undefined,
    });

    const { rows } = await sql`
      INSERT INTO image_posts (image_url, description)
      VALUES (${blob.url}, ${description})
      RETURNING id, image_url, description, created_at;
    `;
    
    return response.status(201).json(rows[0]);

  } catch (error) {
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return response.status(500).json({ error: `Failed to upload image. ${errorMessage}` });
  }
}
