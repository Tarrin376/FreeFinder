import { Router } from 'express';
import savedPostRouter from './SavedPostRouter.js';
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
    deleteUserSession,
    getUserPosts
} from '../controllers/UserController.js';

const userRouter = Router();

userRouter.use('/:username/saved', savedPostRouter);
userRouter.post('/:username/posts', cookieJwtAuth, getUserPosts);

userRouter.param('username', (req, _, next, value) => {
    req.username = value;
    next();
});

userRouter.post('/', registerUser);
userRouter.post('/session', authenticateUser);
userRouter.post('/:usernameOrEmail', findUser);
userRouter.delete('/session', deleteUserSession);

userRouter.get('/jwt-auth', cookieJwtAuth, (req, res) => {
    return res.json({ userData: req.userData });
});

userRouter.put('/:username', cookieJwtAuth, updateUser);
userRouter.put('/:username/profile-picture', cookieJwtAuth, updateProfilePicture);
userRouter.put('/:username/password', cookieJwtAuth, updatePassword);

userRouter.delete('/:username', cookieJwtAuth, deleteUser);

export default userRouter;