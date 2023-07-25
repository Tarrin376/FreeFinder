import { Router } from 'express';
import { 
    createPost, 
    getPost, 
    deletePost, 
    addImage, 
    getPosts, 
    updatePost, 
    deleteImage,
    getSellerSummary
} from '../controllers/PostController.js';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';

const postRouter = Router();

postRouter.post('/', cookieJwtAuth, createPost);
postRouter.post('/all', getPosts);

postRouter.get('/:id', getPost);
postRouter.put('/:id', cookieJwtAuth, updatePost);
postRouter.post('/:id', cookieJwtAuth, addImage);
postRouter.delete('/:id', cookieJwtAuth, deletePost);
postRouter.get('/:id/seller-summary', cookieJwtAuth, getSellerSummary);

postRouter.delete('/:id/:cloudinaryID', cookieJwtAuth, deleteImage);

export default postRouter;