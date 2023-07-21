import { Router } from 'express';
import { createReview } from '../controllers/ReviewController.js';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';

const reviewRouter = Router();

reviewRouter.post('/:username', cookieJwtAuth, createReview);

export default reviewRouter;