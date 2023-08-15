import { Router } from 'express';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';
import { getNotifications, updateToRead, updateAllToRead } from '../controllers/NotificationController.js';

const notificationRouter = Router();

notificationRouter.post('/all', cookieJwtAuth, getNotifications);
notificationRouter.put('/all', cookieJwtAuth, updateAllToRead);
notificationRouter.put('/:id', cookieJwtAuth, updateToRead);

export default notificationRouter;