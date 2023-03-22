import { Router } from 'express';
import { findSellerPosts } from '../controllers/SellerController.js';

const sellerRouter = Router();

sellerRouter.post('/posts/:cursor', findSellerPosts);

export default sellerRouter;