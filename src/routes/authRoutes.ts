import * as authController from "../controllers/authController";
import { Router } from "express";

const router = Router();

router.post('/login', authController.login_post);
router.post('/signup', authController.signup_post);
router.post('/forgot-password', authController.forgot_password_post);
router.post('/reset-password', authController.reset_password_post);

export default router;