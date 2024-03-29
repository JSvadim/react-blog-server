// local imports
import { ApiError } from "../exceptions/api-error.js";
import blogService from "../services/blog-service.js";
import { ImageHandler } from "../helpers/image-handler.js";

class BlogController {
    async getBlog(req, res, next) {
        try {
            
            const blogId = req.query.blogId;
            const userId = req.query.userId;
            if(blogId) {
                // if I have blogId I get one blog by id
                const blog =  await blogService.getBlog(blogId);
                return res.json(blog);
            }
            // if I have userId I get blogs of certain user
            // if userId is undefined blogService returns all blogs
            const blogs =  await blogService.getBlogs(userId);
            res.json(blogs);

        } catch(e) {
            next(e);
        }
    }
    async deleteBlog(req, res, next) {
        try {

        } catch(e) {
            next(e);
        }
    }
    async updateBlog(req, res, next) {
        try {
            
        } catch(e) {
            next(e);
        }
    }
    async addBlog(req, res, next) {
        try {
            const title = req.body.title;
            const text = req.body.text;
            const userId = req.user.id;
            const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

            if(title.length > 60 || text.length > 1999) {
                return next(ApiError.htmlChange())
            }

            // if no files, controller execution ends after this condition
            if(req.files.length === 0) {
                const blog = await blogService.addBlog({title, text, userId, date});
                return res.json(blog);
            }

            // files count checking
            if(req.files.length > 5)  req.files = req.files.slice(0, 5);

            // files format checking
            const isWrongFormat = ImageHandler.extensionCheck(req.files);
            if(isWrongFormat) {
                return next(ApiError.htmlChange());
            }

            // image size checking
            const oversizedImages = ImageHandler.sizeCheck(req.files, 5242880);
            if(oversizedImages) {
                return next(ApiError.FileSizeIsTooBig(oversizedImages));
            }

            // saving files
            const imagesNames = await ImageHandler.saveImages(req.files);
            const blog = await blogService.addBlog({title, text, imagesNames, userId, date});
            res.json(blog);
        } catch(e) {
            next(e);
        }
    }
}

export default new BlogController();
