// third party 
import * as path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v1 } from "uuid";
import imageMin from "imagemin";
import imageSize from "image-size";
import imageminJpegoptim from "imagemin-jpegoptim";
import imageminPngquant from "imagemin-pngquant";


// local imports
import { ApiError } from "../exceptions/api-error.js";
import blogService from "../services/blog-service.js";
import fs from "fs/promises";

class BlogController {
    async getBlog(req, res, next) {
        try {
            const blog =  await blogService.getBlog(req.body.id);
            res.json(blog);
        } catch(e) {
            next(e);
        }
    }
    async getBlogs(req, res, next) {
        try {
            const id = req.query.id || undefined;
            const blogs = await blogService.getBlogs(id);
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
            if(title.length > 199 || text.length > 1999) {
                return next(ApiError.unknown())
            }
            if(req.files.length === 0) {
                const blog = await blogService.addBlog({title, text, userId, date});
                return res.json(blog);
            }
            // files count checking
            if(req.files.length > 5)  req.files = req.files.slice(0, 5);

            // files format checking
            for (let file of req.files) {
                const imageSizes = imageSize(file.buffer);
                if( imageSizes.type === "gif" ||
                    imageSizes.type === "jpg" ||
                    imageSizes.type === "png" ||
                    imageSizes.type === "jpeg"
                ) continue
                return next(ApiError.htmlChange());
            }

            // image size checking
            const MaxSizeInBytes = 5242880;
            const bigImagesNames = []
            for (let i = 0; i < req.files.length; i++) {
                const image = req.files[i];
                if(image.size > MaxSizeInBytes) bigImagesNames.push(image.originalname)
            }
            if(bigImagesNames.length > 0) return next(ApiError.FileSizeIsTooBig(bigImagesNames));

            // files handling
            const imagesNames = []
            await Promise.all(
                req.files.map(async (file) => {
                    const imageSizes = imageSize(file.buffer);
                    const __dirname = dirname(fileURLToPath(import.meta.url));
                    const imageName = v1() + '.' + imageSizes.type;
                    imagesNames.push(imageName);
    
                    // saving file
                    const pathToImage = path.join(__dirname, '..', 'public', 'images', imageName);
                    await fs.writeFile(pathToImage, file.buffer, 'binary');
                    
                    // compressing file and saving 
                    if(imageSizes.type === "gif") return // don't compress gif
                    const pathToCompressedImage = path.join(__dirname, '..', 'public', 'images-compressed', imageName);
                    const compressedImage = await imageMin([pathToImage], {
                        plugins: [
                            imageminJpegoptim({
                                max: 30
                            }),
                            imageminPngquant({
                                quality: [0.6, 0.8]
                            })
                        ]
                    });
                    await fs.writeFile(pathToCompressedImage, compressedImage[0].data, 'binary');
                })
              );
            const blog = await blogService.addBlog({title, text, imagesNames, userId, date});
            res.json(blog);
        } catch(e) {
            next(e);
        }
    }
}

export default new BlogController();
