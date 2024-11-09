import { Router } from 'express';
import { 
    updateSellerDetails, 
    getSellerDetails, 
    getSellers,
    getReviews,
} from '../controllers/SellerController.js';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';
import clientOrderRouter from './ClientOrderRouter.js';

const sellerRouter = Router();

sellerRouter.param('sellerID', (req, _, next, value) => {
    req.sellerID = value;
    next();
});

sellerRouter.use('/:sellerID/orders', clientOrderRouter);

sellerRouter.post('/', getSellers);

sellerRouter.put('/:sellerID', cookieJwtAuth, updateSellerDetails);
sellerRouter.get('/:sellerID', getSellerDetails);

sellerRouter.post('/:sellerID/reviews', getReviews);

export default sellerRouter;