//third-party
import { Router } from "express";

//local
import authController from "../controllers/auth-controller.js";

export const authRouter = new Router();

authRouter.post('/login', authController.logIn);
authRouter.post('/signin', authController.signIn);
authRouter.post('/logout', authController.logOut);
