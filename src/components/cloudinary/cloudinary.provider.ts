import { v2 as cloudinary } from 'cloudinary';
import { Cloudinary } from 'src/constant';

export const CloudinaryProvider = {
    provide: Cloudinary,
    useFactory: (): void => {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
        });
    },
};

