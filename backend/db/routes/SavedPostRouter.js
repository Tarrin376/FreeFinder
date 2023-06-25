import { Router } from 'express';
import { savePost, getSavedPosts, deleteSavedPost } from '../controllers/SavedPostController.js';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';

const savedPostRouter = Router();

savedPostRouter.post('/', getSavedPosts);
savedPostRouter.post('/save/:postID', cookieJwtAuth, savePost);
savedPostRouter.delete('/delete/:postID', cookieJwtAuth, deleteSavedPost);

export default savedPostRouter;