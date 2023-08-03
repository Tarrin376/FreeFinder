import { Router } from 'express';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';
import { sendOrderRequest } from '../controllers/OrderRequestController.js';

const orderRequestRouter = Router();

orderRequestRouter.post('/:postID/:packageType', cookieJwtAuth, sendOrderRequest);

export default orderRequestRouter;