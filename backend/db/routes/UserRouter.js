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

userRouter.put('/update/:username', updateUser);
userRouter.put('/update/profile/:username', updateProfilePicture);
userRouter.put('/update/password/:username', updatePassword);

userRouter.delete('/deleteUser/:username', deleteUser);

export default userRouter;