import { Router } from 'express';
import { getSellerPosts, updateSellerDetails } from '../controllers/SellerController.js';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';

const sellerRouter = Router();

sellerRouter.post('/:username/posts', cookieJwtAuth, getSellerPosts);
sellerRouter.put('/:userID', cookieJwtAuth, updateSellerDetails);

export default sellerRouter;