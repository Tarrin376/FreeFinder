import { Router } from 'express';
import savedPostRouter from './SavedPostRouter.js';
import savedSellerRouter from './SavedSellerRouter.js';
import messageGroupRouter from './MessageGroupRouter.js';
import orderRequestRouter from './OrderRequestRouter.js';
import notificationRouter from './NotificationRouter.js';
import reportRouter from './ReportRouter.js';
import orderRouter from './OrderRouter.js';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';
import { upload } from '../middleware/upload.js';
import 
{ 
    registerUser,
    updateUser,
    deleteUser,
    updatePassword,
    authenticateUser,
    jwtAuthenticateUser,
    deleteUserSession,
    getUserPosts,
    getBalance,
    addToBalance,
    searchUsers
} from '../controllers/UserController.js';

const userRouter = Router();

userRouter.param('username', (req, _, next, value) => {
    req.username = value;
    next();
});

userRouter.use('/:username/saved/posts', savedPostRouter);
userRouter.use('/:username/saved/sellers', savedSellerRouter);
userRouter.use('/:username/message-groups', messageGroupRouter);
userRouter.use('/:username/order-requests', orderRequestRouter);
userRouter.use('/:username/notifications', notificationRouter);
userRouter.use('/:username/orders', orderRouter);
userRouter.use('/:username/reports', reportRouter);

userRouter.post('/:username/posts', cookieJwtAuth, getUserPosts);

userRouter.post('/', registerUser);
userRouter.get('/', searchUsers);

userRouter.post('/session', authenticateUser);
userRouter.delete('/session', cookieJwtAuth, deleteUserSession);
userRouter.post('/jwt-auth', cookieJwtAuth, jwtAuthenticateUser);

userRouter.put('/:username', cookieJwtAuth, upload.single('file'), updateUser);
userRouter.delete('/:username', cookieJwtAuth, deleteUser);

userRouter.put('/:username/password', cookieJwtAuth, updatePassword);
userRouter.get('/:username/balance', cookieJwtAuth, getBalance);
userRouter.put('/:username/balance', cookieJwtAuth, addToBalance);

export default userRouter;