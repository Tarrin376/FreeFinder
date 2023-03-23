import { Router } from 'express';
import 
{ 
    addUser,
    findUser, 
    updateUser, 
    updateProfilePicture, 
    deleteUser,
    updatePassword,
    getSavedPosts
} from '../controllers/UserController.js';

const userRouter = Router();

userRouter.post('/create', addUser);
userRouter.post('/find/:user', findUser);

userRouter.put('/update', updateUser);
userRouter.put('/update/profile', updateProfilePicture);
userRouter.put('/update/profile/password', updatePassword);
userRouter.post('/saved', getSavedPosts);

userRouter.delete('/delete', deleteUser);

export default userRouter;