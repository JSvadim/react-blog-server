// third party 
import { v1 } from "uuid";
import imageMin from "imagemin";
import imageSize from "image-size";
import imageMozjpeg from "imagemin-mozjpeg";
import imageminPngquant from "imagemin-pngquant";
import { imageKit } from "./image-kit.js";


export class ImageHandler {
    static extensionCheck(files) {
        // if one of files has not right extension returns true
        for (let file of files) {
            const imageSizes = imageSize(file.buffer);
            if( imageSizes.type === "gif" ||
                imageSizes.type === "jpg" ||
                imageSizes.type === "png" ||
                imageSizes.type === "jpeg"
            ) continue
            return true
        }
    }
    static sizeCheck(files, MaxSizeInBytes) {
        // if one or few files are oversized returns array with their names
        const bigImagesNames = []
        for (let i = 0; i < files.length; i++) {
            const image = files[i];
            if(image.size > MaxSizeInBytes) {
                bigImagesNames.push(image.originalname)
            }
        }
        if(bigImagesNames.length > 0) return bigImagesNames
    }
    static async compressImage(pathToImage) {
        // accepts path where original image is and compresses it
        const compressedImage = await imageMin([pathToImage], {
            plugins: [
                imageMozjpeg({
                    quality: 30, 
                    progressive: true
                }),
                imageminPngquant({
                    quality: [0.6, 0.8]
                })
            ]
        });
        return compressedImage
    }
    static async saveImages(files) {
        // saves image to imagekit.io, 
        // returns string containing images names separated with " " 
        const imagesNamesArray = []
        await Promise.all(
            files.map(async (file) => {
                const imageSizes = imageSize(file.buffer);
                const imageName = v1() + '.' + imageSizes.type;

                // saving file
                const uploadedImage = await imageKit.upload({
                    file: file.buffer,
                    fileName: imageName,
                    folder: "blog-images"
                })
                imagesNamesArray.push(uploadedImage.name);
            })
        );
        return imagesNamesArray.join(" "); 
    }
}