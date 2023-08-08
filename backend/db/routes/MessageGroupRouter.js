import { Router } from 'express';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';
import messageRouter from './MessageRouter.js';
import createdMessageGroupRouter from './CreatedMessageGroupRouter.js';
import { 
    getMessageGroups, 
    leaveMessageGroup,
    clearUnreadMessages
} from '../controllers/MessageGroupController.js';

const messageGroupRouter = Router();

messageGroupRouter.param('groupID', (req, _, next, value) => {
    req.groupID = value;
    next();
});

messageGroupRouter.use('/:groupID/messages', messageRouter);
messageGroupRouter.use('/created', createdMessageGroupRouter);

messageGroupRouter.post('/all', cookieJwtAuth, getMessageGroups);
messageGroupRouter.delete('/:groupID', cookieJwtAuth, leaveMessageGroup);
messageGroupRouter.delete('/:groupID/unreadMessages', cookieJwtAuth, clearUnreadMessages);

export default messageGroupRouter;