import { Router } from 'express';
import 
{ 
    addUser,
    findUser, 
    updateUser, 
    updateProfilePicture, 
    deleteUser,
    updatePassword
} from '../controllers/UserController.js';

const userRouter = Router();

userRouter.post('/createUser', addUser);
userRouter.post('/findUser/:usernameOrEmail', findUser);

userRouter.put('/update', updateUser);
userRouter.put('/update/profile', updateProfilePicture);
userRouter.put('/update/password', updatePassword);

userRouter.delete('/deleteUser', deleteUser);

export default userRouter;