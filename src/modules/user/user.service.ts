import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";  
import httpStatus from "http-status";
import config from "../../config";
import { RegisterUserPayload } from "../interface/user.interface";




const registerUserIntoDB = async (payload: RegisterUserPayload) => {
    const { name, email, password, profilePhoto } = payload;
    
    const userExists = await prisma.user.findUnique({ where: { email } }); 
     if (userExists) {
        throw new Error('User already exists');
     }
     
     const hashedPassword = await bcrypt.hash(password, Number(config.bcryptSaltRounds));
     
     const newUser = await prisma.user.create({
          data: {
               name,
               email,
               password: hashedPassword,
               profile: {
                    create: {
                        profilePhoto
                    }
               }
          }
     });

    // await prisma.profile.create({
    //     data: {
    //             userId: newUser.id,
    //             profilePhoto
    //     }
    //  })

    const user = await prisma.user.findUnique({
        where: {
            id: newUser.id
        },
        omit: {
            password: true
        },
        include: {
            profile: true
        }
    })
    return user;
}

export const userService = {
    registerUserIntoDB
}