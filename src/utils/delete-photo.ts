import { del } from '@vercel/blob';

export async function deletePhoto(photo: string | null) {
  if (!photo) return;

  // Ignora caminhos antigos de arquivos locais.
  if (!photo.startsWith('https://')) return;

  const photoUrl = new URL(photo);

  // Evita tentar excluir URLs que não pertencem ao Vercel Blob.
  if (!photoUrl.hostname.endsWith('.blob.vercel-storage.com')) {
    return;
  }

  await del(photo);
}
