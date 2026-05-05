import { Request, Response } from "express";
import sequelize from "../../database/connection";
import generateRandomInstituteNumber from "../../services/generateRandomNumber";
class InstituteController {
    static async createInstitute(req: Request, res: Response) {
        const { instituteName, instituteEmail, institutePhoneNumber, instituteAddress } = req.body
        const  instituteVatNo  = req.body.instituteVatNo || null
        const  institutePanNo  = req.body.institutePanNo || null
        if (!instituteName || !instituteEmail || !institutePhoneNumber || !instituteAddress) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }
        // if data is valid, create institute in database and return success response
        const instituteNumber = generateRandomInstituteNumber()
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

        await sequelize.query(`CREATE TABLE IF NOT EXISTS teacher_${instituteNumber} (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            teacherName VARCHAR(255) NOT NULL,
            teacherEmail VARCHAR(255) NOT NULL UNIQUE,
            teacherPhoneNumber VARCHAR(20) NOT NULL UNIQUE,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )`)
        res.status(201).json({
            message: "Institute created successfully"
        })
    }
}

export default InstituteController;