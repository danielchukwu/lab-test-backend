import * as authController from "../controllers/authController";
import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";

const authRouter = Router();

authRouter.post('/login', authController.login_post);
authRouter.post('/signup', authController.signup_post);
authRouter.post('/forgot-password', authController.forgot_password_post);
authRouter.post('/reset-password', authController.reset_password_post);
authRouter.post('/change-password/:userId', requireAuth, authController.change_password_post);

export default authRouter;