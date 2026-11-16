import { Router } from 'express';
import { authRoutes } from '../modules/auth/routes/auth.routes.ts';
import { productRoutes } from '../modules/products/routes/product.routes.ts';
import { userRoutes } from './user.routes.ts';

const routes = Router();

routes.use('/products', productRoutes);
routes.use('/users', userRoutes);
routes.use('/auth', authRoutes);

export default routes;
