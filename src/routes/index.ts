import { Router } from 'express';
import { authRoutes } from './auth.routes.ts';
import { productRoutes } from './product.routes.ts';
import { userRoutes } from './user.routes.ts';

const routes = Router();

routes.use('/products', productRoutes);
routes.use('/users', userRoutes);
routes.use('/auth', authRoutes);

export default routes;
