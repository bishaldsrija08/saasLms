// Multer configuration

import multer from 'multer';
import { Request } from 'express';

// Configure storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb: any) {
        cb(null, 'src/storage'); // Specify the destination directory for uploaded files
    },
    filename: function (req: Request, file: Express.Multer.File, cb: any) {
        cb(null, Date.now() + "-" + file.originalname); // Generate a unique filename for the uploaded file
    }
})

export {
    multer,
    storage
}