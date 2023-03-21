import { Router } from 'express';
import { createPost, savePost, getPost } from '../controllers/PostController.js';

const postRouter = Router();

postRouter.post('/createPost', createPost);
postRouter.post('/savePost', savePost);
postRouter.get('/getPost/', getPost)

export default postRouter;