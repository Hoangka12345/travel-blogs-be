import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
    async uploadAvatar(file: Express.Multer.File): Promise<string> {
        // just accept image file
        if (!file || !file.mimetype.startsWith('image/')) {
            throw new HttpException("Just accepting image file!", HttpStatus.UNSUPPORTED_MEDIA_TYPE)
        }
        try {
            const base64Data = file.buffer.toString('base64');
            const result = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${base64Data}`, {
                folder: 'avatars' //save image in fouler avatars of cloudinary
            });
            return result.url;
        } catch (error) {
            throw error
        }
    }

    async uploadBlogFiles(files: Array<Express.Multer.File>): Promise<string[]> {

        const result = await Promise.all(
            files.map(file => {
                const base64Data = file.buffer.toString('base64');
                return cloudinary.uploader.upload(`data:${file.mimetype};base64,${base64Data}`, {
                    folder: "images" //save images for each blogs in folder images
                });
            })
        )
        return result.map(item => item.url)
    }

    private getAssetId(url: string): string {
        // Loại bỏ phần domain và phần mở rộng file từ URL
        const id = url.replace(
            'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/',
            ''
        ).replace(/\.\w{3,4}$/, '');

        return id;
    }

    async deleteFile(url: string): Promise<boolean> {
        try {
            const publicId = this.getAssetId(url);
            await cloudinary.uploader.destroy(publicId);
            return true
        } catch (error) {
            console.error('err in delete file:', error);
            return false
        }
    }
}
