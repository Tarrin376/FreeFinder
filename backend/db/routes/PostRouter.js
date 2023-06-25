import { Router } from 'express';
import { createPost, getPost, deletePost, addPostImage } from '../controllers/PostController.js';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';

const postRouter = Router();

postRouter.post('/create', cookieJwtAuth, createPost);
postRouter.get('/:id', getPost);
postRouter.delete('/:id/delete', cookieJwtAuth, deletePost);
postRouter.post('/:id/add-image', cookieJwtAuth, addPostImage);

export default postRouter;