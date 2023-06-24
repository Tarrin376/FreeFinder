import { Router } from 'express';
import { createPost, getPost, deletePost } from '../controllers/PostController.js';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';

const postRouter = Router();

postRouter.post('/create', cookieJwtAuth, createPost);
postRouter.get('/find', getPost);
postRouter.delete('/delete', cookieJwtAuth, deletePost);

export default postRouter;