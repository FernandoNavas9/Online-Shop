import { put } from '@vercel/blob';
import { sql } from '@vercel/postgres';
import formidable from 'formidable';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';

// Disable the default Vercel body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const form = formidable({});

  try {
    const [fields, files] = await form.parse(req);

    // Helper to extract string values from formidable fields
    const getField = (fieldName: string) => {
      const value = fields[fieldName];
      return Array.isArray(value) ? value[0] : value;
    };
    
    const { name, description, price, stock, category, subcategory, color, brand, size } = {
        name: getField('name'),
        description: getField('description'),
        price: getField('price'),
        stock: getField('stock'),
        category: getField('category'),
        subcategory: getField('subcategory'),
        color: getField('color'),
        brand: getField('brand'),
        size: getField('size'),
    };
    
    if (!name || !price || !stock || !category || !subcategory) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const imageFiles = files.images;
    const uploadedImageUrls: string[] = [];

    if (imageFiles) {
        const filesArray = Array.isArray(imageFiles) ? imageFiles : [imageFiles];
        for (const file of filesArray) {
            if (file) {
                const fileContent = await fs.promises.readFile(file.filepath);
                const blob = await put(file.originalFilename || 'unknown-file', fileContent, {
                    access: 'public',
                });
                uploadedImageUrls.push(blob.url);
            }
        }
    }
    
    if (uploadedImageUrls.length === 0) {
        return res.status(400).json({ message: 'At least one image is required' });
    }

    // FIX: Convert JS array to PostgreSQL array format
    const imagesPgArray = `{${uploadedImageUrls.join(',')}}`;

    const result = await sql`
      INSERT INTO products (name, description, price, stock, category, subcategory, color, brand, size, images)
      VALUES (${name}, ${description}, ${Number(price)}, ${Number(stock)}, ${category}, ${subcategory}, ${color || null}, ${brand || null}, ${size || null}, ${imagesPgArray})
      RETURNING *;
    `;

    return res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error('Error adding product:', error);
    return res.status(500).json({ message: 'Failed to add product' });
  }
}