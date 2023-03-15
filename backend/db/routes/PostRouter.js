import { Router } from 'express';
import { createPost } from '../controllers/PostController.js';

const postRouter = Router();

postRouter.post('/createPost/:userID', createPost);

export default postRouter;