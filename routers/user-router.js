import { Router } from "express";
import UserController from "../controllers/user-controller.js";

export const userRouter = new Router();

userRouter.get('', UserController.getOneUser);
userRouter.get('/all', UserController.getAllUsers);
userRouter.get('/activate-account/:link', UserController.activate);
userRouter.put('', UserController.updateUser);