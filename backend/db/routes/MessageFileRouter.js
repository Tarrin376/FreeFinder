import { Router } from 'express';
import { addMessageFile } from '../controllers/MessageFileController.js';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';

const messageFileRouter = Router();

messageFileRouter.post('/', cookieJwtAuth, addMessageFile);

export default messageFileRouter;