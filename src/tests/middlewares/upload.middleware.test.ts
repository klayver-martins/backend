import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { errorMiddleware } from '../../middlewares/error.middleware.ts';
import { upload } from '../../middlewares/upload.middleware.ts';

function createApp() {
  const app = express();

  app.post('/upload', upload.single('photo'), (req, res) => {
    return res.status(200).json({
      originalname: req.file?.originalname,
      mimetype: req.file?.mimetype,
      size: req.file?.size,
      hasBuffer: Buffer.isBuffer(req.file?.buffer),
    });
  });

  app.use(errorMiddleware);

  return app;
}

describe('Upload Middleware', () => {
  it('deve aceitar imagem JPEG', async () => {
    const response = await request(createApp())
      .post('/upload')
      .attach('photo', Buffer.from('imagem de teste'), {
        filename: 'foto.jpg',
        contentType: 'image/jpeg',
      });

    expect(response.status).toBe(200);
    expect(response.body.originalname).toBe('foto.jpg');
    expect(response.body.mimetype).toBe('image/jpeg');
    expect(response.body.hasBuffer).toBe(true);
    expect(response.body.size).toBe(Buffer.from('imagem de teste').length);
  });

  it('deve aceitar imagem PNG', async () => {
    const response = await request(createApp())
      .post('/upload')
      .attach('photo', Buffer.from('imagem de teste'), {
        filename: 'foto.png',
        contentType: 'image/png',
      });

    expect(response.status).toBe(200);
    expect(response.body.originalname).toBe('foto.png');
    expect(response.body.mimetype).toBe('image/png');
    expect(response.body.hasBuffer).toBe(true);
  });

  it('deve aceitar imagem WEBP', async () => {
    const response = await request(createApp())
      .post('/upload')
      .attach('photo', Buffer.from('imagem de teste'), {
        filename: 'foto.webp',
        contentType: 'image/webp',
      });

    expect(response.status).toBe(200);
    expect(response.body.originalname).toBe('foto.webp');
    expect(response.body.mimetype).toBe('image/webp');
    expect(response.body.hasBuffer).toBe(true);
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

  it('deve rejeitar arquivos maiores que 4 MB', async () => {
    const arquivoGrande = Buffer.alloc(4 * 1024 * 1024 + 1);

    const response = await request(createApp()).post('/upload').attach('photo', arquivoGrande, {
      filename: 'foto.jpg',
      contentType: 'image/jpeg',
    });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('File too large');
  });

  it('deve aceitar arquivos com exatamente 4 MB', async () => {
    const arquivo = Buffer.alloc(4 * 1024 * 1024);

    const response = await request(createApp()).post('/upload').attach('photo', arquivo, {
      filename: 'foto.jpg',
      contentType: 'image/jpeg',
    });

    expect(response.status).toBe(200);
    expect(response.body.size).toBe(4 * 1024 * 1024);
    expect(response.body.hasBuffer).toBe(true);
  });

  it('deve continuar a requisição quando nenhum arquivo é enviado', async () => {
    const response = await request(createApp()).post('/upload');

    expect(response.status).toBe(200);
    expect(response.body.originalname).toBeUndefined();
    expect(response.body.mimetype).toBeUndefined();
    expect(response.body.hasBuffer).toBe(false);
  });
});
