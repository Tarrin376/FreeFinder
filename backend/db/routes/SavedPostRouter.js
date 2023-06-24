import { Router } from 'express';
import { savePost, getSavedPosts, deleteSavedPost } from '../controllers/SavedPostController.js';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';

const savedPostRouter = Router();

savedPostRouter.post('/save', cookieJwtAuth, savePost);
savedPostRouter.post('/get-posts', getSavedPosts);
savedPostRouter.delete('/delete', cookieJwtAuth, deleteSavedPost);

export default savedPostRouter;