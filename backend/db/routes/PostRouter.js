import { Router } from 'express';
import { createPost, savePost, getPost, deletePost } from '../controllers/PostController.js';

const postRouter = Router();

postRouter.post('/create', createPost);
postRouter.post('/save', savePost);
postRouter.get('/find', getPost);
postRouter.delete('/delete', deletePost);

export default postRouter;