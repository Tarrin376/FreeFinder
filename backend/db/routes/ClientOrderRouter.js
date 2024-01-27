import { Router } from 'express';
import { getClientOrders, cancelClientOrder } from '../controllers/ClientOrderController.js';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';

const clientOrderRouter = Router();

clientOrderRouter.post('/', cookieJwtAuth, getClientOrders);
clientOrderRouter.delete('/:id', cookieJwtAuth, cancelClientOrder);

export default clientOrderRouter;