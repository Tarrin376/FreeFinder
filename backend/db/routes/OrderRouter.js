import { Router } from 'express';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';
import { getOrders, updateCompleteOrderRequest } from '../controllers/OrderController.js';

const orderRouter = Router();

orderRouter.post('/', cookieJwtAuth, getOrders);
orderRouter.put('/:id/complete-order-requests/:requestID', cookieJwtAuth, updateCompleteOrderRequest);

export default orderRouter;