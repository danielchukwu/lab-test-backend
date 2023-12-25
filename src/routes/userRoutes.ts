import { Router } from 'express';
import * as userController from '../controllers/userController';

const userRouter = Router();

userRouter.get('/:id', userController.user_get);
userRouter.get('', userController.users_get);

userRouter.put('/:id', userController.user_put);
userRouter.delete('/:id', userController.user_delete);

export default userRouter;