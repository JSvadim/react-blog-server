import { Router } from "express";
import BlogController from "../controllers/blog-controller.js";
import multer from "multer";
import { authMiddleware } from "../middlewares/auth-middleware.js";
const upload = multer();

export const blogRouter = new Router();

blogRouter.get("", BlogController.getBlog);
blogRouter.post("",
    authMiddleware,
    upload.any(),
    BlogController.addBlog); 
blogRouter.put("", BlogController.updateBlog);
blogRouter.delete("", BlogController.deleteBlog);