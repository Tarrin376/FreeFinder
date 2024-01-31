import { Router } from 'express';
import { getClientOrders, cancelClientOrder, sendCompleteOrderRequest } from '../controllers/ClientOrderController.js';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';

const clientOrderRouter = Router();

clientOrderRouter.post('/:id/complete-order-requests', cookieJwtAuth, sendCompleteOrderRequest);
clientOrderRouter.post('/', cookieJwtAuth, getClientOrders);
clientOrderRouter.delete('/:id', cookieJwtAuth, cancelClientOrder);

export default clientOrderRouter;