import { Router } from "express";
import BlogController from "../controllers/blog-controller.js";

export const blogRouter = new Router();

blogRouter.get("", BlogController.getBlog);
blogRouter.get("/100", BlogController.getBlogs);
blogRouter.put("/add", BlogController.addBlog);
blogRouter.delete("/delete", BlogController.deleteBlog);