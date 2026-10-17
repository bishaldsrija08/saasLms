import { Request, Response } from "express";
import sequelize from "../../database/connection";
import { generateRandomNumber } from "../../services/generate.random.numbrer";

export const createInstitute = async (req: Request, res: Response) => {
    const { instituteName, instituteEmail, instituteAddress, institutePhoneNumber } = req.body
    const { instituteVatNumber } = req.body || null
    const { institutePanNumber } = req.body || null

    if (!instituteName || !instituteEmail || !instituteAddress || !institutePhoneNumber) {
        return res.status(400).json({
            message: "Please provide all information."
        })

    }
    const instituteNumber = generateRandomNumber()
    sequelize.query(`CREATE TABLE IF NOT EXISTS institute_${instituteNumber} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        instituteName VARCHAR(255) NOT NULL UNIQUE,
        instituteEmail VARCHAR(255) NOT NULL UNIQUE,
        instituteAddress VARCHAR(255) NOT NULL,
        institutePhoneNumber VARCHAR(20) NOT NULL UNIQUE,
        instituteVatNumber VARCHAR(50) UNIQUE,
        institutePanNumber VARCHAR(50) UNIQUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`)

    // Using replacement parameters to prevent SQL injection
    await sequelize.query(`INSERT INTO institute_${instituteNumber} (instituteName, instituteEmail, instituteAddress, institutePhoneNumber, instituteVatNumber, institutePanNumber)
            VALUES (?, ?, ?, ?, ?, ?)`, {
        replacements: [instituteName, instituteEmail, instituteAddress, institutePhoneNumber, instituteVatNumber, institutePanNumber]
    })


    // Create a new table for teacher table
    sequelize.query(`CREATE TABLE IF NOT EXISTS teacher_${instituteNumber} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        teacherName VARCHAR(255) NOT NULL,
        teacherEmail VARCHAR(255) NOT NULL UNIQUE,
        teacherPhoneNumber VARCHAR(20) NOT NULL UNIQUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP        
        )`)
    return res.status(201).json({
        message: "Institute created successfully."
    })


}