import { Router } from 'express';
import { getPostReviews, createReview } from '../controllers/ReviewController.js';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';

const reviewRouter = Router();

reviewRouter.post('/:postID', getPostReviews);
reviewRouter.post('/:username/:postID', cookieJwtAuth, createReview);

export default reviewRouter;