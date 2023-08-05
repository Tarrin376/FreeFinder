import { Router } from 'express';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';
import { sendOrderRequest, updateOrderRequestStatus } from '../controllers/OrderRequestController.js';

const orderRequestRouter = Router();

orderRequestRouter.post('/:seller/:postID/:packageType', cookieJwtAuth, sendOrderRequest);
orderRequestRouter.put('/:id', cookieJwtAuth, updateOrderRequestStatus);

export default orderRequestRouter;