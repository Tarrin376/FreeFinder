import { Router } from 'express';
import { updateSellerDetails, getSellerDetails } from '../controllers/SellerController.js';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';

const sellerRouter = Router();

sellerRouter.put('/:username', cookieJwtAuth, updateSellerDetails);
sellerRouter.get('/:username', getSellerDetails);

export default sellerRouter;