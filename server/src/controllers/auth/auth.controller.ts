import { Request, Response } from 'express'
import User from '../../models/user.moel'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import envConfig from '../../confit/config'


// Register user
export const registerUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Please provide all information."
        })
    }

    await User.create({
        username,
        email,
        password: await bcrypt.hash(password, 10)
    })
    return res.status(201).json({
        message: "User created successfully."
    })
}

// Login user

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Please provide all information."
        })
    }

    const user = await User.findOne({ where: { email } })
    if (!user) {
        return res.status(404).json({
            message: "User not found."
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid password."
        })
    }

    const token = jwt.sign({id: user.id}, envConfig.JWT_SECRET, {expiresIn: "30d"})
    return res.status(200).json({
        message: "Login successful.",
        data: token
    })
}