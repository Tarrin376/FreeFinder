import { Router } from 'express';
import { 
    updateSellerDetails, 
    getSellerDetails, 
    getSellers,
    getReviews,
} from '../controllers/SellerController.js';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';

const sellerRouter = Router();

sellerRouter.post('/', getSellers);
sellerRouter.put('/:sellerID', cookieJwtAuth, updateSellerDetails);
sellerRouter.get('/:sellerID', getSellerDetails);
sellerRouter.post('/:sellerID/reviews', getReviews);

export default sellerRouter;