import { Router } from 'express';
import 
{ 
    addUser,
    getUser, 
    updateUser, 
    updateProfilePicture, 
    deleteUser,
    updatePassword,
    getSavedPosts,
    loginUser,
    logoutUser
} from '../controllers/UserController.js';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';

const userRouter = Router();
userRouter.post('/create', addUser);
userRouter.post('/getUser', getUser);
userRouter.post('/login', loginUser);
userRouter.get('/logout', cookieJwtAuth, logoutUser);

userRouter.get('/authoriseUser', cookieJwtAuth, (req, res) => {
    return res.json({ userData: req.userData });
});

userRouter.put('/update', cookieJwtAuth, updateUser);
userRouter.put('/update/profile-picture', cookieJwtAuth, updateProfilePicture);
userRouter.put('/update/password', cookieJwtAuth, updatePassword);
userRouter.post('/saved', getSavedPosts);

userRouter.delete('/delete', deleteUser);

export default userRouter;