import { Router } from 'express';
import { addMessageFile } from '../controllers/MessageFileController.js';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';
import { upload } from '../middleware/upload.js';

const messageFileRouter = Router();

messageFileRouter.post('/', cookieJwtAuth, upload.single('file'), addMessageFile);

export default messageFileRouter;