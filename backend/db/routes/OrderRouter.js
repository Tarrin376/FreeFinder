import { Router } from 'express';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';
import { createOrder, getOrders } from '../controllers/OrderController.js';

const orderRouter = Router();

orderRouter.post('/', cookieJwtAuth, createOrder);
orderRouter.get('/', cookieJwtAuth, getOrders);

export default orderRouter;