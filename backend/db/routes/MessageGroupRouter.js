import { Router } from 'express';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';
import messageRouter from './MessageRouter.js';
import { 
    getMessageGroups, 
    leaveMessageGroup,
    createMessageGroup, 
    deleteMessageGroup, 
    updateMessageGroup, 
    removeUser
} from '../controllers/MessageGroupController.js';

const messageGroupRouter = Router();

messageGroupRouter.param('groupID', (req, _, next, value) => {
    req.groupID = value;
    next();
});

messageGroupRouter.use('/:groupID/messages', messageRouter);

messageGroupRouter.post('/all', cookieJwtAuth, getMessageGroups);
messageGroupRouter.delete('/:groupID', cookieJwtAuth, leaveMessageGroup);

messageGroupRouter.post('/created', cookieJwtAuth, createMessageGroup);
messageGroupRouter.delete('/created/:groupID', cookieJwtAuth, deleteMessageGroup);
messageGroupRouter.put('/created/:groupID', cookieJwtAuth, updateMessageGroup);
messageGroupRouter.delete('/created/:groupID/:removeUserID', cookieJwtAuth, removeUser);

export default messageGroupRouter;