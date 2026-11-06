import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import path from 'node:path';

import { getAbsoluteFSPath } from 'swagger-ui-dist';
import swaggerUi from 'swagger-ui-express';

import { swaggerSpec } from './config/swagger.ts';
import { errorMiddleware } from './middlewares/error.middleware.ts';
import routes from './routes/index.ts';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

// Swagger: disponibiliza os arquivos estáticos explicitamente.
const swaggerAssetsPath = getAbsoluteFSPath();

app.use(
  '/api-docs',
  express.static(swaggerAssetsPath, {
    index: false,
  }),
);

app.use('/api-docs', swaggerUi.setup(swaggerSpec));

app.use('/uploads', express.static(path.resolve(process.cwd(), 'src/uploads')));

app.get('/health', (_req, res) => {
  return res.status(200).send('ok');
});

app.use(routes);

app.use(errorMiddleware);

export default app;
