import { Router } from 'express';
import { createPost, findSellerPosts, savePost } from '../controllers/PostController.js';

const postRouter = Router();

postRouter.post('/createPost/:userID', createPost);
postRouter.get('/sellerPosts/:userID/:cursor', findSellerPosts);
postRouter.post('/savePost', savePost);

export default postRouter;