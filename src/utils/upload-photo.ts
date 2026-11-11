import { put } from '@vercel/blob';
import { randomUUID } from 'node:crypto';

export async function uploadPhoto(file: Express.Multer.File) {
  console.log('Blob token disponível:', Boolean(process.env.BLOB_READ_WRITE_TOKEN));

  const extension = file.originalname.split('.').pop()?.toLowerCase() || 'jpg';
  const filename = `products/${randomUUID()}.${extension}`;

  const blob = await put(filename, file.buffer, {
    access: 'public',
    contentType: file.mimetype,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return blob.url;
}
