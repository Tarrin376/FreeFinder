import { Router } from 'express';
import { savePost, getSavedPosts } from '../controllers/SavedPostController.js';

const savedPostRouter = Router();

savedPostRouter.post('/save', savePost);
savedPostRouter.post('/get-posts', getSavedPosts);

export default savedPostRouter;