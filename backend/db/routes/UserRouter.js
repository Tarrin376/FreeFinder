import { Router } from 'express';
import savedPostRouter from './SavedPostRouter.js';
import savedSellerRouter from './SavedSellerRouter.js';
import messageRouter from './MessageRouter.js';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';
import 
{ 
    registerUser,
    updateUser, 
    updateProfilePicture, 
    deleteUser,
    updatePassword,
    authenticateUser,
    jwtAuthenticateUser,
    deleteUserSession,
    getUserPosts,
    getBalance,
    addToBalance,
    searchUsers,
    getMessageGroups,
    createMessageGroup,
    removeUserFromGroup,
    deleteGroup,
    leaveGroup,
    updateGroup
} from '../controllers/UserController.js';

const userRouter = Router();

userRouter.param('username', (req, _, next, value) => {
    req.username = value;
    next();
});

userRouter.param('groupID', (req, _, next, value) => {
    req.groupID = value;
    next();
});

userRouter.use('/:username/saved/posts', savedPostRouter);
userRouter.use('/:username/saved/sellers', savedSellerRouter);
userRouter.use('/:username/message-groups/:groupID/messages', messageRouter);

userRouter.post('/:username/posts', cookieJwtAuth, getUserPosts);

userRouter.post('/', registerUser);
userRouter.get('/', searchUsers);

userRouter.post('/session', authenticateUser);
userRouter.delete('/session', cookieJwtAuth, deleteUserSession);
userRouter.post('/jwt-auth', cookieJwtAuth, jwtAuthenticateUser);

userRouter.put('/:username', cookieJwtAuth, updateUser);
userRouter.delete('/:username', cookieJwtAuth, deleteUser);

userRouter.put('/:username/profile-picture', cookieJwtAuth, updateProfilePicture);
userRouter.put('/:username/password', cookieJwtAuth, updatePassword);
userRouter.get('/:username/balance', cookieJwtAuth, getBalance);
userRouter.put('/:username/balance', cookieJwtAuth, addToBalance);

userRouter.post('/:username/message-groups/all', cookieJwtAuth, getMessageGroups);
userRouter.delete('/:username/message-groups/:groupID', cookieJwtAuth, leaveGroup);

userRouter.post('/:username/created-groups', cookieJwtAuth, createMessageGroup);
userRouter.delete('/:username/created-groups/:groupID', cookieJwtAuth, deleteGroup);
userRouter.put('/:username/created-groups/:groupID', cookieJwtAuth, updateGroup);
userRouter.delete('/:username/created-groups/:groupID/:removeUserID', cookieJwtAuth, removeUserFromGroup);

export default userRouter;