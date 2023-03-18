import { Router } from 'express';
import { findSellerPosts } from '../controllers/SellerController.js';

const sellerRouter = Router();

sellerRouter.get('/posts/:userID/:cursor', findSellerPosts);

export default sellerRouter;