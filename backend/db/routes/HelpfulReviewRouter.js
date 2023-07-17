import { Router } from 'express';
import { markAsHelpful, markAsUnhelpful } from '../controllers/HelpfulReviewController.js';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';

const helpfulReviewRouter = Router();

helpfulReviewRouter.post('/:username/:postID/:reviewID', cookieJwtAuth, markAsHelpful);
helpfulReviewRouter.delete('/:username/:postID/:reviewID', cookieJwtAuth, markAsUnhelpful);

export default helpfulReviewRouter;