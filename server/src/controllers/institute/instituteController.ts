import { NextFunction, Request, Response } from "express";
import sequelize from "../../database/connection";
import generateRandomInstituteNumber from "../../services/generateRandomNumber";
import { IExtendedRequest } from "../../middleware/type";
import User from "../../database/models/userModel";
import categories from "../../seed";
import { QueryTypes } from "sequelize";
class InstituteController {
    static async createInstitute(req: IExtendedRequest, res: Response, next: NextFunction) {
        const { instituteName, instituteEmail, institutePhoneNumber, instituteAddress } = req.body
        const instituteVatNo = req.body.instituteVatNo || null
        const institutePanNo = req.body.institutePanNo || null
        if (!instituteName || !instituteEmail || !institutePhoneNumber || !instituteAddress) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        // if data is valid, create institute in database and return success response
        const instituteNumber = generateRandomInstituteNumber()
        req.instituteNumber = instituteNumber
        await sequelize.query(`CREATE TABLE IF NOT EXISTS institute_${instituteNumber} (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            instituteName VARCHAR(255) NOT NULL UNIQUE,
            instituteEmail VARCHAR(255) NOT NULL UNIQUE,
            institutePhoneNumber VARCHAR(20) NOT NULL UNIQUE,
            instituteAddress VARCHAR(255) NOT NULL,
            instituteVatNo VARCHAR(255),
            institutePanNo VARCHAR(255),
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )`)

        await sequelize.query(`INSERT INTO institute_${instituteNumber}(instituteName, instituteEmail, institutePhoneNumber, instituteAddress, instituteVatNo, institutePanNo) VALUES (?, ?, ?, ?, ?, ?)`, {
            replacements: [instituteName, instituteEmail, institutePhoneNumber, instituteAddress, instituteVatNo, institutePanNo]
        })

        // To create user_institute for history
        await sequelize.query(`CREATE TABLE IF NOT EXISTS user_institute (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            userId VARCHAR(255) REFERENCES users(id),
            instituteNumber VARCHAR(255) UNIQUE,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )`)

        if (req.user) {
            await sequelize.query(`INSERT INTO user_institute(userId, instituteNumber) VALUES (?, ?)`, {
                replacements: [req.user?.id, instituteNumber]
            })
            await User.update({
                currentInstituteNumber: instituteNumber,
                role: "institute"
            }, {
                where: { id: req.user.id }
            })
        }
        next()
    }
    static async createTeacherTable(req: IExtendedRequest, res: Response, next: NextFunction) {
        const instituteNumber = req.instituteNumber;
        await sequelize.query(`CREATE TABLE IF NOT EXISTS teacher_${instituteNumber}(
               id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()), 
              teacherName VARCHAR(255) NOT NULL, 
              teacherEmail VARCHAR(255) NOT NULL UNIQUE, 
              teacherPhoneNumber VARCHAR(255) NOT NULL UNIQUE,
              teacherExperience VARCHAR(255), 
              joinedDate DATE, 
              salary VARCHAR(100),
              teacherPhoto VARCHAR(255), 
              teacherPassword VARCHAR(255),
              courseId VARCHAR(100) REFERENCES course_${instituteNumber}(id), // which course teacher is teaching
              createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
              updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
              )`)
        next()
    }
    static async createStudentTable(req: IExtendedRequest, res: Response, next: NextFunction) {
        const instituteNumber = req.instituteNumber;
        await sequelize.query(`CREATE TABLE IF NOT EXISTS student_${instituteNumber}(
            id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
            studentName VARCHAR(255) NOT NULL, 
            studentPhoneNo VARCHAR(255) NOT NULL UNIQUE, 
            studentAddress TEXT, 
            enrolledDate DATE, 
            studentImage VARCHAR(255),
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
            )`)
        next()
    }
    static async createCourseTable(req: IExtendedRequest, res: Response, next: NextFunction) {
        const instituteNumber = req.instituteNumber;
        await sequelize.query(`CREATE TABLE IF NOT EXISTS course_${instituteNumber}(
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        courseName VARCHAR(255) NOT NULL UNIQUE, 
        coursePrice VARCHAR(255) NOT NULL, 
        courseDuration VARCHAR(100) NOT NULL, 
        courseLevel ENUM('beginner','intermediate','advance') NOT NULL, 
        courseThumbnail VARCHAR(200),
        courseDescription TEXT, 
        teacherId VARCHAR(36) REFERENCES teacher_${instituteNumber}(id), // which teacher is teaching the course
        categoryId VARCHAR(36) NOT NULL REFERENCES category_${instituteNumber} (id), // which category course belongs to
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`)
        next()
    }
    static async createCategoryTable(req: IExtendedRequest, res: Response, next: NextFunction) {
        const instituteNumber = req.instituteNumber;
        await sequelize.query(`CREATE TABLE IF NOT EXISTS category_${instituteNumber}(
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        categoryName VARCHAR(100) NOT NULL, 
        categoryDescription TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`)

        categories.forEach(async function (category) {
            await sequelize.query(`INSERT INTO category_${instituteNumber}(categoryName, categoryDescription) VALUES (?, ?)`, {
                replacements: [category.categoryName, category.categoryDescription]
            })
        })
        next()
    }
    static async createChapterLessonTable(req: IExtendedRequest, res: Response) {
        const instituteNumber = req.instituteNumber;
        await sequelize.query(`CREATE TABLE IF NOT EXISTS chapter_lesson_${instituteNumber}(
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()), 
        lessonName VARCHAR(255) NOT NULL, 
        lessonDescription TEXT, 
        lessonVideoUrl VARCHAR(200) NOT NULL, 
        lessonThumbnailUrl VARCHAR(200) NOT NULL, 
        chapterId VARCHAR(36) REFERENCES course_chapter_${instituteNumber}(id) ON DELETE CASCADE ON UPDATE CASCADE, // which chapter lesson belongs to
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

        )`, {
            type: QueryTypes.INSERT
        })

        res.status(201).json({
            message: "Institute created successfully",
            instituteNumber
        })
    }
}

export default InstituteController;