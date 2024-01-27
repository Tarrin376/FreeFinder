import { Router } from 'express';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';
import { getOrders } from '../controllers/OrderController.js';

const orderRouter = Router();

orderRouter.post('/my-orders', cookieJwtAuth, getOrders);

export default orderRouter;