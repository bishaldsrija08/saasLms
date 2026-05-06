import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import envConfig from "../config/envConfig";
import User from "../database/models/userModel";
import { IExtendedRequest } from "./type";


class Middleware{
    static isLoggedIn(req: IExtendedRequest, res: Response, next: NextFunction){
        // Check if user is logged in
        // If logged in, call next()
        // If not logged in, return error response
        const token = req.headers.authorization
        console.log(token)
        if(!token){
            return res.status(401).json({
                message: "Unauthorized"
            })
        }
        // Verify token and get user data
        // If token is valid, call next()
        // If token is invalid, return error response
        jwt.verify(token, envConfig.jwtSecret, async (err, decoded: any)=>{
            if(err){
                return res.status(401).json({
                    message: "Unauthorized"
                })
            }
            const id = decoded.id
            const userData = await User.findOne({
                where: {id},
                attributes: ["id", "currentInstituteNumber", "role"]
            })
            if(!userData){
                return res.status(404).json({
                    message: "User not found"
                })
            }
            req.user ={
                id: userData.id,
                currentInstituteNumber: userData.currentInstituteNumber,
                role: userData.role
            }
            next()
        })
    }

    static restrictTo(req: Request, res: Response, next: NextFunction){

    }
}

export default Middleware;