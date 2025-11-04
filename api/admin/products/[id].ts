import { del, put } from '@vercel/blob';
import { sql } from '@vercel/postgres';
import formidable from 'formidable';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  // --- DELETE Product ---
  if (req.method === 'DELETE') {
    try {
      // First, get the image URLs to delete them from the blob store
      const productResult = await sql`SELECT images FROM products WHERE id = ${id}`;
      if (productResult.rows.length === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      const { images } = productResult.rows[0];
      
      // Delete images from Vercel Blob
      if (images && images.length > 0) {
        await del(images);
      }

      // Delete the product from the database
      await sql`DELETE FROM products WHERE id = ${id}`;
      
      return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      return res.status(500).json({ message: 'Failed to delete product' });
    }
  }

  // --- UPDATE Product ---
  if (req.method === 'PUT') {
    const form = formidable({});
    try {
        const [fields, files] = await form.parse(req);

        const getField = (fieldName: string) => {
            const value = fields[fieldName];
            return Array.isArray(value) ? value[0] : value;
        };

        const { name, description, price, stock, category, subcategory, color, brand, size, existingImages } = {
            name: getField('name'),
            description: getField('description'),
            price: getField('price'),
            stock: getField('stock'),
            category: getField('category'),
            subcategory: getField('subcategory'),
            color: getField('color'),
            brand: getField('brand'),
            size: getField('size'),
            existingImages: getField('existingImages') || '',
        };

        if (!name || !price || !stock || !category || !subcategory) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
        // Handle images to keep
        let finalImageUrls = existingImages.split(',').filter(Boolean);

        // Handle new image uploads
        const imageFiles = files.images;
        if (imageFiles) {
            const filesArray = Array.isArray(imageFiles) ? imageFiles : [imageFiles];
            for (const file of filesArray) {
                if (file) {
                    const fileContent = await fs.promises.readFile(file.filepath);
                    const blob = await put(file.originalFilename || 'unknown-file', fileContent, { access: 'public' });
                    finalImageUrls.push(blob.url);
                }
            }
        }
        
        if (finalImageUrls.length === 0) {
            return res.status(400).json({ message: 'Product must have at least one image.' });
        }

        const imagesPgArray = `{${finalImageUrls.join(',')}}`;
        
        const result = await sql`
            UPDATE products
            SET name = ${name}, description = ${description}, price = ${Number(price)}, stock = ${Number(stock)}, category = ${category}, subcategory = ${subcategory}, color = ${color || null}, brand = ${brand || null}, size = ${size || null}, images = ${imagesPgArray}
            WHERE id = ${id}
            RETURNING *;
        `;

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({ message: 'Failed to update product' });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}