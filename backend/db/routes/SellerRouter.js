import { Router } from 'express';
import { findSellerPosts, updateSellerDetails } from '../controllers/SellerController.js';

const sellerRouter = Router();

sellerRouter.post('/posts', findSellerPosts);
sellerRouter.put('/update', updateSellerDetails);

export default sellerRouter;