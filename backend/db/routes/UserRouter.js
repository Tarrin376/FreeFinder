import { Router } from 'express';
import 
{ 
    addUser,
    findUser, 
    updateUser, 
    updateProfilePicture, 
    deleteUser,
    updatePassword,
    getSavedPosts,
    loginUser,
    logoutUser
} from '../controllers/UserController.js';
import jwt from 'jsonwebtoken';
import { env } from 'process';

const authoriseUser = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.sendStatus(403);
    }

    try {
        const {iat, exp, ...data} = jwt.verify(token, env.JWT_SECRET_KEY);
        return res.json({ userData: data });
    } catch {
        return res.sendStatus(403);
    }
};

const userRouter = Router();
userRouter.post('/create', addUser);
userRouter.post('/find', findUser);
userRouter.post('/login', loginUser);
userRouter.get('/logout', logoutUser)
userRouter.get('/authorise', authoriseUser);

userRouter.put('/update', updateUser);
userRouter.put('/update/profile', updateProfilePicture);
userRouter.put('/update/profile/password', updatePassword);
userRouter.post('/saved', getSavedPosts);

userRouter.delete('/delete', deleteUser);

export default userRouter;