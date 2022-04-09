import { Router } from "express";
import userController from "../controllers/user-controller.js";

export const userRouter = new Router();

userRouter.get('/:id/:email', userController.getOneUser);
userRouter.get('/', userController.getAllUsers);
userRouter.put('/:id', userController.updateUser);