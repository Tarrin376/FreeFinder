import { Router } from 'express';
import { createPost, savePost, getSavedPosts } from '../controllers/PostController.js';

const postRouter = Router();

postRouter.post('/createPost', createPost);
postRouter.post('/savePost', savePost);
postRouter.post('/savedPosts', getSavedPosts);

export default postRouter;