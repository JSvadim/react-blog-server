import { Router } from "express";
import BlogController from "../controllers/blog-controller.js";
import multer from "multer";
import { authMiddleware } from "../middlewares/auth-middleware.js";
const upload = multer();

export const blogRouter = new Router();

blogRouter.get("", BlogController.getBlog);
blogRouter.get("/all", BlogController.getBlogs);
blogRouter.post("/add",
    authMiddleware,
    upload.any(),
    BlogController.addBlog); 
blogRouter.put("/update", BlogController.updateBlog);
blogRouter.delete("/delete", BlogController.deleteBlog);