import { Router } from 'express';
import { getClientOrders, cancelClientOrder, sendCompleteOrderRequest, updateCompleteOrderRequest } from '../controllers/ClientOrderController.js';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';

const clientOrderRouter = Router();

clientOrderRouter.post('/:id/complete-order-requests', cookieJwtAuth, sendCompleteOrderRequest);
clientOrderRouter.put('/:id/complete-order-requests/:requestID', cookieJwtAuth, updateCompleteOrderRequest);

clientOrderRouter.post('/', cookieJwtAuth, getClientOrders);
clientOrderRouter.delete('/:id', cookieJwtAuth, cancelClientOrder);

export default clientOrderRouter;