import { Router } from 'express';
import { createPost, findSellerPosts } from '../controllers/PostController.js';

const postRouter = Router();

postRouter.post('/createPost/:userID', createPost);
postRouter.get('/sellerPosts/:userID/:cursor', findSellerPosts)

export default postRouter;