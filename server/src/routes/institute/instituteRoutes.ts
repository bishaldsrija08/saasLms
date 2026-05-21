import express, { Router } from "express"
import InstituteController from "../../controllers/institute/instituteController"
import Middleware from "../../middleware/middleware"
import asyncErrorHandler from "../../services/asyncErrorHandler"
const router: Router = express.Router()

router.route("/create").post(Middleware.isLoggedIn, asyncErrorHandler(InstituteController.createInstitute), asyncErrorHandler(InstituteController.createTeacherTable), asyncErrorHandler(InstituteController.createStudentTable), asyncErrorHandler(InstituteController.createCourseTable), asyncErrorHandler(InstituteController.createCategoryTable),
    asyncErrorHandler(InstituteController.createChapterLessonTable))



export default router