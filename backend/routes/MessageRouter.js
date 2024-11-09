import { Router } from 'express';
import { getMessages, sendMessage } from '../controllers/MessageController.js';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';
import messageFileRouter from './MessageFileRouter.js';

const messageRouter = Router();

messageRouter.param('messageID', (req, _, next, value) => {
    req.messageID = value;
    next();
});

messageRouter.use('/:messageID/files', messageFileRouter);

messageRouter.post('/all', cookieJwtAuth, getMessages);
messageRouter.post('/', cookieJwtAuth, sendMessage);

export default messageRouter;