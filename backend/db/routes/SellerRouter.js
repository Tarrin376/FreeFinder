import { Router } from 'express';
import { getSellerPosts, updateSellerDetails } from '../controllers/SellerController.js';

const sellerRouter = Router();

sellerRouter.post('/:id/posts', getSellerPosts);
sellerRouter.put('/update', updateSellerDetails);

export default sellerRouter;