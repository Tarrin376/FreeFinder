import { Router } from 'express';
import savedPostRouter from './SavedPostRouter.js';
import savedSellerRouter from './SavedSellerRouter.js';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';
import 
{ 
    registerUser,
    findUser, 
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
    searchUsers
} from '../controllers/UserController.js';

const userRouter = Router();

userRouter.use('/:username/saved/posts', savedPostRouter);
userRouter.use('/:username/saved/sellers', savedSellerRouter);
userRouter.post('/:username/posts', cookieJwtAuth, getUserPosts);

userRouter.param('username', (req, _, next, value) => {
    req.username = value;
    next();
});

userRouter.post('/', registerUser);
userRouter.get('/', searchUsers);

userRouter.post('/session', authenticateUser);
userRouter.delete('/session', cookieJwtAuth, deleteUserSession);
userRouter.post('/jwt-auth', cookieJwtAuth, jwtAuthenticateUser);

userRouter.post('/:usernameOrEmail', findUser);
userRouter.put('/:username', cookieJwtAuth, updateUser);
userRouter.delete('/:username', cookieJwtAuth, deleteUser);
userRouter.put('/:username/profile-picture', cookieJwtAuth, updateProfilePicture);
userRouter.put('/:username/password', cookieJwtAuth, updatePassword);
userRouter.get('/:username/balance', cookieJwtAuth, getBalance);
userRouter.put('/:username/balance', cookieJwtAuth, addToBalance);

export default userRouter;