import { Router } from 'express';
import { createPost, savePost, getPost } from '../controllers/PostController.js';

const postRouter = Router();

postRouter.post('/create', createPost);
postRouter.post('/save', savePost);
postRouter.get('/find', getPost);

export default postRouter;