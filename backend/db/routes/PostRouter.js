import { Router } from 'express';
import { createPost, getPost, deletePost } from '../controllers/PostController.js';

const postRouter = Router();

postRouter.post('/create', createPost);
postRouter.get('/find', getPost);
postRouter.delete('/delete', deletePost);

export default postRouter;