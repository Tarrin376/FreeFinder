import { Router } from 'express';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';
import { 
    createMessageGroup, 
    deleteMessageGroup, 
    updateMessageGroup, 
    removeUser 
} from '../controllers/CreatedMessageGroupController.js';

const createdMessageGroupRouter = Router();

createdMessageGroupRouter.post('/', cookieJwtAuth, createMessageGroup);
createdMessageGroupRouter.delete('/:groupID', cookieJwtAuth, deleteMessageGroup);
createdMessageGroupRouter.put('/:groupID', cookieJwtAuth, updateMessageGroup);
createdMessageGroupRouter.delete('/:groupID/:removeUserID', cookieJwtAuth, removeUser);

export default createdMessageGroupRouter;