import { v2 as cloudinary } from "cloudinary";

 cloudinary.config({
    cloud_name: process.env.PUBLIC_URL_ENDPOINT,
    api_key:process.env.IMAGEKIT_PUBLIC_KEY,
    api_secret:process.env.IMAGEKIT_PRIVATE_KEY
});
export default cloudinary