import express, { Router } from "express"
import InstituteController from "../../controllers/institute/instituteController"
import Middleware from "../../middleware/middleware"
const router:Router = express.Router()

router.route("/create").post(Middleware.isLoggedIn, InstituteController.createInstitute, InstituteController.createTeacherTable,InstituteController.createStudentTable, InstituteController.createCourseTable)



export default router