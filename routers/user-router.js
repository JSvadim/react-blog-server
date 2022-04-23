import { Router } from "express";
import userController from "../controllers/user-controller.js";

export const userRouter = new Router();

userRouter.get('', userController.getOneUser);
userRouter.get('/all', userController.getAllUsers);
userRouter.get('/activate-account/:link', userController.activate);
userRouter.put('', userController.updateUser);