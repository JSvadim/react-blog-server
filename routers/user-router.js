import { Router } from "express";
import userController from "../controllers/user-controller.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";

export const userRouter = new Router();

userRouter.get('', userController.getOneUser);
userRouter.get('/all', authMiddleware, userController.getAllUsers);
userRouter.get('/activate-account/:link', userController.activate);
userRouter.put('', userController.updateUser);