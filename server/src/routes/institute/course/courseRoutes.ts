import express, { Router } from "express"
import Middleware from "../../../middleware/middleware"
import asyncErrorHandler from "../../../services/asyncErrorHandler"
import { createCourse, deleteCourse, getAllCourses, getSingleCourse } from "../../../controllers/institute/course/courseController"
const router: Router = express.Router()

router.route("/").post(Middleware.isLoggedIn, asyncErrorHandler(createCourse)).get(Middleware.isLoggedIn, asyncErrorHandler(getAllCourses))
router.route("/:id").delete(Middleware.isLoggedIn, asyncErrorHandler(deleteCourse)).get(Middleware.isLoggedIn, asyncErrorHandler(getSingleCourse))

export default router