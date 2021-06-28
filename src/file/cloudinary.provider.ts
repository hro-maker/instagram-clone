import { v2 } from 'cloudinary';

const CLOUDINARY='Cloudinary'
export const CloudinaryProvider = {
    provide: CLOUDINARY,
    useFactory: () => {
      return v2.config({
        cloud_name: 'my-instagramm-clonee',
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY,
      });
    },
  };