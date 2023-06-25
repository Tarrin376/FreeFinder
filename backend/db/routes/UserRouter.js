import { Router } from 'express';
import savedPostRouter from './SavedPostRouter.js';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';
import 
{ 
    registerUser,
    getUser, 
    updateUser, 
    updateProfilePicture, 
    deleteUser,
    updatePassword,
    loginUser,
    logoutUser
} from '../controllers/UserController.js';

const userRouter = Router();

userRouter.use('/:userID/saved-posts', savedPostRouter);

userRouter.post('/register', registerUser);
userRouter.post('/getUser', getUser);
userRouter.post('/login', loginUser);
userRouter.get('/logout', logoutUser);

userRouter.get('/jwtLogin', cookieJwtAuth, (req, res) => {
    return res.json({ userData: req.userData });
});

userRouter.put('/update', cookieJwtAuth, updateUser);
userRouter.put('/update/profile-picture', cookieJwtAuth, updateProfilePicture);
userRouter.put('/update/password', cookieJwtAuth, updatePassword);

userRouter.delete('/delete', cookieJwtAuth, deleteUser);

export default userRouter;