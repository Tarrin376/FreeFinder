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
    deleteUserSession
} from '../controllers/UserController.js';

const userRouter = Router();

userRouter.use('/:userID/saved-posts', savedPostRouter);

userRouter.param('userID', (req, _, next, value) => {
    req.userID = value;
    next();
});

userRouter.post('/', registerUser);
userRouter.post('/session', authenticateUser);
userRouter.post('/:usernameOrEmail', findUser);
userRouter.delete('/session', deleteUserSession);

userRouter.get('/jwt-auth', cookieJwtAuth, (req, res) => {
    return res.json({ userData: req.userData });
});

userRouter.put('/:userID', cookieJwtAuth, updateUser);
userRouter.put('/:userID/profile-picture', cookieJwtAuth, updateProfilePicture);
userRouter.put('/:userID/password', cookieJwtAuth, updatePassword);

userRouter.delete('/:userID', cookieJwtAuth, deleteUser);

export default userRouter;