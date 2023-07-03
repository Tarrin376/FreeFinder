import { Router } from 'express';
import { savePost, getSavedPosts, deleteSavedPost } from '../controllers/SavedPostController.js';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';

const savedPostRouter = Router();

savedPostRouter.post('/', cookieJwtAuth, getSavedPosts);
savedPostRouter.post('/:postID', cookieJwtAuth, savePost);
savedPostRouter.delete('/:postID', cookieJwtAuth, deleteSavedPost);

export default savedPostRouter;