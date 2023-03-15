import { Router } from 'express';
import { addUser, findUser, updateUser, updateProfilePicture } from '../controllers/UserController.js';

const userRouter = Router();

userRouter.post('/createUser', addUser);
userRouter.post('/findUser/:usernameOrEmail', findUser);
userRouter.put('/update/:username', updateUser);
userRouter.put('/profile/update/:username', updateProfilePicture);

export default userRouter;