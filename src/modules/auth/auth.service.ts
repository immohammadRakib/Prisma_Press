import { threadCpuUsage } from "node:process";
import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth.interface"
import  jwt  from "jsonwebtoken";
import bcrypt from "bcryptjs";


const loginUser = async ( payload: ILoginUser) => {
    const { email, password } = payload;

    // const user = await prisma.user.findUnique({
    //     where: { email }
    // })
    // if( !user ){
    //     throw new Error("user not found")
    // }
   
    const user = await prisma.user.findUniqueOrThrow({ where: { email }})

    const isPasswordMatched = await bcrypt.compare(password, user.password)
    if( !isPasswordMatched ){
        throw new Error("password doesn't match")
    }

    const accessToken = jwt.sign({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }, 'accesscrete', {
        expiresIn: "1d"
    })


    const refreshToken = jwt.sign({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }, 'refreshsecrete', {
        expiresIn: "7d"
    })
    
    
    
    return { accessToken, refreshToken };

}


export const authService = {
    loginUser,
}