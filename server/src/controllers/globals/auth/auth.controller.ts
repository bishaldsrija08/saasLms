/*
Register
Login
Forgot Password
Verify Email
Verify one-time password (OTP)
Change Password
Logout
*/
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { Request, Response } from "express"
import User from "../../../database/models/userModel";
import envConfig from "../../../config/envConfig";

class AuthController {
    static async registerUser(req: Request, res: Response) {
        const { username, password, email } = req.body
        // Validate input
        if (!username || !password || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } }); // returns object if user exists, otherwise null
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        await User.create({
            username,
            password: await bcrypt.hash(password, 10), // Hash the password before saving
            email
        })
        res.status(201).json({
            message: "User registered successfully"
        });
        // Hash password
        // Save user to database
    }

    // Login
    static async loginUser(req: Request, res: Response) {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            })
        }
        const user = await User.findOne({
            where: { email }
        })
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        const isPasswordValid = bcrypt.compareSync(password, user.password)
        if (!isPasswordValid) {
            return res.status(403).json({
                message: "Invalid password"
            })
        }
        const secret = envConfig.jwtSecret
        res.status(200).json({
            token: jwt.sign({id: user.id}, secret, {
                expiresIn: "30d"
            }),
            message: "Login successful"
        })
    }
}

export default AuthController;