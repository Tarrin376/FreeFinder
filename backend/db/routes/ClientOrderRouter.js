import { Router } from 'express';
import { getClientOrders } from '../controllers/ClientOrderController.js';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';

const clientOrderRouter = Router();

clientOrderRouter.post('/', cookieJwtAuth, getClientOrders);

export default clientOrderRouter;