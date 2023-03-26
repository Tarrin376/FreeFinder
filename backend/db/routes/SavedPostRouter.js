import { Router } from 'express';
import { savePost, getSavedPosts, deleteSavedPost } from '../controllers/SavedPostController.js';

const savedPostRouter = Router();

savedPostRouter.post('/save', savePost);
savedPostRouter.post('/get-posts', getSavedPosts);
savedPostRouter.delete('/delete', deleteSavedPost);

export default savedPostRouter;