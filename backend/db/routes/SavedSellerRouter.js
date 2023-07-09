import { Router } from 'express';
import { getSavedSellers, saveSeller, deleteSavedSeller } from '../controllers/SavedSellerController.js';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';

const savedSellerRouter = Router();

savedSellerRouter.post('/', cookieJwtAuth, getSavedSellers);
savedSellerRouter.post('/:sellerID', cookieJwtAuth, saveSeller);
savedSellerRouter.delete('/:sellerID', cookieJwtAuth, deleteSavedSeller);

export default savedSellerRouter;