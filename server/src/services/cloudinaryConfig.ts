import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary"
import envConfig from "../config/envConfig";

cloudinary.config({
    cloud_name: envConfig.cloudinaryCloudName,
    api_key: envConfig.cloudinaryApiKey,
    api_secret: envConfig.cloudinaryApiSecret
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => ({
        folder: "lms"

    })
})

export {
    cloudinary,
    storage
}