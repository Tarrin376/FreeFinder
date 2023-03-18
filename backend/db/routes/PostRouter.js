import { Router } from 'express';
import { createPost, savePost } from '../controllers/PostController.js';

const postRouter = Router();

postRouter.post('/createPost/:userID', createPost);
postRouter.post('/savePost', savePost);

export default postRouter;