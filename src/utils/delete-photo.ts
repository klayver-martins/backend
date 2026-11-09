import fs from 'node:fs/promises';
import path from 'node:path';

export async function deletePhoto(photo: string | null) {
  if (!photo) return;

  const photoPath = path.resolve(process.cwd(), 'src', photo);

  try {
    await fs.unlink(photoPath);
  } catch (error) {
    if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) {
      throw error;
    }
  }
}
