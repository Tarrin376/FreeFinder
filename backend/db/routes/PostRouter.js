import { Router } from 'express';
import { createPost, getPost, deletePost, addImage, getPosts, updatePost } from '../controllers/PostController.js';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';

const postRouter = Router();

postRouter.post('/', cookieJwtAuth, createPost);
postRouter.post('/all', getPosts);
postRouter.get('/:id', getPost);
postRouter.put('/:id', cookieJwtAuth, updatePost)
postRouter.delete('/:id', cookieJwtAuth, deletePost);
postRouter.post('/:id', cookieJwtAuth, addImage);

export default postRouter;