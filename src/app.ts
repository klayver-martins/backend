import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import path from 'node:path';

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.ts';
import { errorMiddleware } from './middlewares/error.middleware.ts';
import routes from './routes/index.ts';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173', // endereço do seu frontend
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/uploads', express.static(path.resolve(process.cwd(), 'src/uploads')));

app.use(routes);

app.get('/health', (_req, res) => {
  return res.status(200).send('ok');
});

app.use(errorMiddleware);

export default app;
