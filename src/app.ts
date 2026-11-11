import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.ts';
import { errorMiddleware } from './middlewares/error.middleware.ts';
import routes from './routes/index.ts';

const app = express();

app.use(
  cors({
    origin: process.env.URL_FRONTEND,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(routes);

app.get('/health', (_req, res) => {
  return res.status(200).send('ok');
});

app.use(errorMiddleware);

export default app;
