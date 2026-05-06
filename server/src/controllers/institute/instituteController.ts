import { NextFunction, Request, Response } from "express";
import sequelize from "../../database/connection";
import generateRandomInstituteNumber from "../../services/generateRandomNumber";
import { IExtendedRequest } from "../../middleware/type";
import User from "../../database/models/userModel";
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
                role: "institue"
            }, {
                where: { id: req.user.id }
            })
        }
        next()
    }
    static async createTeacherTable(req: IExtendedRequest, res: Response, next: NextFunction) {
        const instituteNumber = req.instituteNumber;
        await sequelize.query(`CREATE TABLE IF NOT EXISTS teacher_${instituteNumber} (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            teacherName VARCHAR(255) NOT NULL,
            teacherEmail VARCHAR(255) NOT NULL UNIQUE,
            teacherPhoneNumber VARCHAR(20) NOT NULL UNIQUE,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )`)
        next()
    }
    static async createStudentTable(req: IExtendedRequest, res:Response, next: NextFunction){
        const instituteNumber = req.instituteNumber;
        await sequelize.query(`CREATE TABLE IF NOT EXISTS student_${instituteNumber}(
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            studentName VARCHAR(255) NOT NULL,
            studentEmail VARCHAR(255) NOT NULL UNIQUE,
            studentPhoneNumber VARCHAR(20) NOT NULL UNIQUE,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )`)
            next()
    }
    static async createCourseTable(req: IExtendedRequest, res:Response, next: NextFunction){
        const instituteNumber = req.instituteNumber;
        await sequelize.query(
            `CREATE TABLE IF NOT EXISTS course_${instituteNumber}(
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            courseName VARCHAR(255) NOT NULL,
            courseDescription TEXT,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )`
        )
        // next()
        res.status(201).json({
            message: "Institute created successfully",
            instituteNumber
        })
    }
}

export default InstituteController;