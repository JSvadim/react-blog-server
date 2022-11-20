// third party 
import * as path from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { v1 } from "uuid";
import fs from "fs/promises";
import imageMin from "imagemin";
import imageSize from "image-size";
import imageminJpegoptim from "imagemin-jpegoptim";
import imageminPngquant from "imagemin-pngquant";


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
                imageminJpegoptim({
                    max: 30
                }),
                imageminPngquant({
                    quality: [0.6, 0.8]
                })
            ]
        });
        return compressedImage
    }
    static async saveImages(files) {
        // saves original image and compressed image, 
        // returns string containing images names separated with " " 
        const imagesNamesArray = []
        await Promise.all(
            files.map(async (file) => {
                const imageSizes = imageSize(file.buffer);
                const __dirname = dirname(fileURLToPath(import.meta.url));
                const imageName = v1() + '.' + imageSizes.type;
                imagesNamesArray.push(imageName);

                // saving file
                const pathToImage = path.join(__dirname, '..', 'public', 'images', imageName);
                await fs.writeFile(pathToImage, file.buffer, 'binary');
                
                // compressing file and saving 
                if(imageSizes.type === "gif") return // don't compress gif
                const pathToCompressedImage = path.join(__dirname, '..', 'public', 'images-compressed', imageName);
                const compressedImage = await this.compressImage(pathToImage);
                await fs.writeFile(pathToCompressedImage, compressedImage[0].data, 'binary');
            })
        );
        return imagesNamesArray.join(" "); 
    }
}