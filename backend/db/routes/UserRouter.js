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

const authorise = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.sendStatus(403);
    }

    try {
        const {iat, exp, ...data} = jwt.verify(token, env.JWT_SECRET_KEY);
        req.userData = data;
        return next();
    } catch (err) {
        return res.sendStatus(403);
    }
};

const userRouter = Router();
userRouter.post('/create', addUser);
userRouter.post('/find', findUser);
userRouter.post('/login', loginUser);
userRouter.get('/logout', authorise, logoutUser);

userRouter.get('/authorise', authorise, (req, res) => {
    return res.json({ userData: req.userData });
});

userRouter.put('/update', authorise, updateUser);
userRouter.put('/update/profile-picture', authorise, updateProfilePicture);
userRouter.put('/update/password', updatePassword);
userRouter.post('/saved', getSavedPosts);

userRouter.delete('/delete', deleteUser);

export default userRouter;