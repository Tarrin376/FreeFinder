import { Router } from 'express';
import { 
    updateSellerDetails, 
    getSellerDetails, 
    getSellers,
    getSellerReviews,
    createSellerReview
} from '../controllers/SellerController.js';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';

const sellerRouter = Router();

sellerRouter.get('/:username/reviews', getSellerReviews);
sellerRouter.post('/:username/reviews', createSellerReview);

sellerRouter.put('/:username', cookieJwtAuth, updateSellerDetails);
sellerRouter.post('/', getSellers);
sellerRouter.get('/:username', getSellerDetails);

export default sellerRouter;