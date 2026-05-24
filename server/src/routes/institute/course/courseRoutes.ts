import express, { Request, Router } from "express"
import Middleware from "../../../middleware/middleware"
import asyncErrorHandler from "../../../services/asyncErrorHandler"
import { createCourse, deleteCourse, getAllCourses, getSingleCourse } from "../../../controllers/institute/course/courseController"
import multer from "multer"
// import { multer, storage } from "./../../../middleware/multerMiddleware"
const router: Router = express.Router()

// const upload = multer({
//     storage
// })

import { cloudinary, storage } from "../../../services/cloudinaryConfig"
const upload = multer({
    storage: storage,
    fileFilter: function (req: Request, file: Express.Multer.File, cb: any) {
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!allowedTypes.includes(file.mimetype)) {
            const error = new Error("Invalid file type. Only JPEG, PNG and JPG are allowed.");
            return cb(error);
        }
        cb(null, true);
    },
    limits: {
        fileSize: 1024 * 2
    }
})

router.route("/").post(Middleware.isLoggedIn, upload.single("courseThumbnail"), asyncErrorHandler(createCourse)).get(Middleware.isLoggedIn, asyncErrorHandler(getAllCourses))
router.route("/:id").delete(Middleware.isLoggedIn, asyncErrorHandler(deleteCourse)).get(Middleware.isLoggedIn, asyncErrorHandler(getSingleCourse))

export default router