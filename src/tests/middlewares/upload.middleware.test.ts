import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';

import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { errorMiddleware } from '../../middlewares/error.middleware.ts';
import { upload } from '../../middlewares/upload.middleware.ts';

const uploadDir = path.resolve(process.cwd(), 'src/uploads');

function createApp() {
  const app = express();

  app.post('/upload', upload.single('photo'), (req, res) => {
    return res.status(200).json({
      filename: req.file?.filename,
      mimetype: req.file?.mimetype,
      size: req.file?.size,
    });
  });

  app.use(errorMiddleware);

  return app;
}

describe('Upload Middleware', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('deve aceitar imagem JPEG', async () => {
    const response = await request(createApp())
      .post('/upload')
      .attach('photo', Buffer.from('imagem de teste'), {
        filename: 'foto.jpg',
        contentType: 'image/jpeg',
      });

    expect(response.status).toBe(200);
    expect(response.body.filename).toMatch(/\.jpg$/);
    expect(response.body.mimetype).toBe('image/jpeg');

    await fs.unlink(path.join(uploadDir, response.body.filename));
  });

  it('deve aceitar imagem PNG', async () => {
    const response = await request(createApp())
      .post('/upload')
      .attach('photo', Buffer.from('imagem de teste'), {
        filename: 'foto.png',
        contentType: 'image/png',
      });

    expect(response.status).toBe(200);
    expect(response.body.filename).toMatch(/\.png$/);

    await fs.unlink(path.join(uploadDir, response.body.filename));
  });

  it('deve aceitar imagem WEBP', async () => {
    const response = await request(createApp())
      .post('/upload')
      .attach('photo', Buffer.from('imagem de teste'), {
        filename: 'foto.webp',
        contentType: 'image/webp',
      });

    expect(response.status).toBe(200);
    expect(response.body.filename).toMatch(/\.webp$/);

    await fs.unlink(path.join(uploadDir, response.body.filename));
  });

  it('deve rejeitar formato de arquivo não permitido', async () => {
    const response = await request(createApp())
      .post('/upload')
      .attach('photo', Buffer.from('arquivo de teste'), {
        filename: 'arquivo.pdf',
        contentType: 'application/pdf',
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Formato de imagem não permitido.');
  });

  it('deve rejeitar arquivos maiores que 5 MB', async () => {
    const arquivoGrande = Buffer.alloc(5 * 1024 * 1024 + 1);

    const response = await request(createApp()).post('/upload').attach('photo', arquivoGrande, {
      filename: 'foto.jpg',
      contentType: 'image/jpeg',
    });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('File too large');
  });
});
