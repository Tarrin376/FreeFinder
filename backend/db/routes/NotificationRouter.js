import { Router } from 'express';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';
import { getNotifications, updateToRead } from '../controllers/NotificationController.js';

const notificationRouter = Router();

notificationRouter.post('/all', cookieJwtAuth, getNotifications);
notificationRouter.put('/:id', cookieJwtAuth, updateToRead);

export default notificationRouter;