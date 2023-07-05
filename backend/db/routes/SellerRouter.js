import { Router } from 'express';
import { updateSellerDetails, getSellerDetails, getSellers } from '../controllers/SellerController.js';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';

const sellerRouter = Router();

sellerRouter.put('/:username', cookieJwtAuth, updateSellerDetails);
sellerRouter.get('/', getSellers);
sellerRouter.get('/:username', getSellerDetails);

export default sellerRouter;