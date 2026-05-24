import { Request, Response } from "express";
import sequelize from "../../../database/connection";
import { IExtendedRequest } from "../../../middleware/type";

const createCourse = (req: IExtendedRequest, res: Response) => {
    const instituteNumber = req.user?.currentInstituteNumber;
    const { courseName, coursePrice, courseDuration, courseLevel, courseDescription } = req.body;
    if (!courseName || !coursePrice || !courseDuration || !courseLevel || !courseDescription) {
        return res.status(400).json({ message: "All fields are required" })
    }

    const courseThumbnail =  req.file ? req.file.path : null;

    sequelize.query(`INSERT INTO course_${instituteNumber}(courseName, coursePrice, courseDuration, courseLevel, courseDescription, courseThumbnail) VALUES (?, ?, ?, ?, ?, ?)`, {
        replacements: [courseName, coursePrice, courseDuration, courseLevel, courseDescription, courseThumbnail]
    })

    res.status(201).json({ message: "Course created successfully" })
}

const deleteCourse = async (req: IExtendedRequest, res: Response) => {
    const instituteNumber = req.user?.currentInstituteNumber;
    const courseId = req.params.id;
    // Check if course exists
    const [courseData] = await sequelize.query(`SELECT * FROM course_${instituteNumber} WHERE id = ?`, {
        replacements: [courseId]
    })

    if (courseData.length === 0) {
        return res.status(404).json({ message: "Course not found" })
    }

    sequelize.query(`DELETE FROM course_${instituteNumber} WHERE id = ?`, {
        replacements: [courseId]
    })
    res.status(200).json({ message: "Course deleted successfully" })
}

// Get all courses of an institute

const getAllCourses = async (req: IExtendedRequest, res: Response) => {
    const instituteNumber = req.user?.currentInstituteNumber;
    const [courses] = await sequelize.query(`SELECT * FROM course_${instituteNumber}`)
    res.status(200).json({
        data: courses || [],
        message: "Courses retrieved successfully"
    })
}

// Single course
const getSingleCourse = async (req: IExtendedRequest, res: Response) => {
    const instituteNumber = req.user?.currentInstituteNumber;
    const courseId = req.params.id;
    const [courseData] = await sequelize.query(`SELECT * FROM course_${instituteNumber} WHERE id = ?`, {
        replacements: [courseId]
    })
    if (courseData.length === 0) {
        return res.status(404).json({ message: "Course not found" })
    }
    res.status(200).json({
        data: courseData[0],
        message: "Course retrieved successfully"
    })
}

export {
    createCourse,
    deleteCourse,
    getAllCourses,
    getSingleCourse
}