import { Router } from 'express';
import { createPost, getPost, deletePost, addImage, getPosts } from '../controllers/PostController.js';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';

const postRouter = Router();

postRouter.post('/', cookieJwtAuth, createPost);
postRouter.post('/all', getPosts);
postRouter.get('/:id', getPost);
postRouter.delete('/:id', cookieJwtAuth, deletePost);
postRouter.post('/:id', cookieJwtAuth, addImage);

export default postRouter;