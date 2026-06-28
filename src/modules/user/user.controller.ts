import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";  
import httpStatus from "http-status";
import config from "../../config";
import { userService } from "./user.service";


const registerUser = async (req: Request, res: Response) => {
    const payload = req.body;
    
    const user  = await userService.registerUserIntoDB(payload);
     
    res.status(httpStatus.CREATED).json({ 
    message: 'User registered successfully',
    data: {
        user
    }

})}


export const userController = {
    registerUser
}