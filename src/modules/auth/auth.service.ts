import { threadCpuUsage } from "node:process";
import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth.interface"
import  jwt, { SignOptions }  from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";


const loginUser = async ( payload: ILoginUser) => {
    const { email, password } = payload;

    // const user = await prisma.user.findUnique({
    //     where: { email }
    // })
    // if( !user ){
    //     throw new Error("user not found")
    // }
   
    const user = await prisma.user.findUniqueOrThrow({ where: { email }})

    if( user.activeStatus === "BLOCKED"){
        throw new Error("your account blocked, contract support")
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password)
    if( !isPasswordMatched ){
        throw new Error("password doesn't match")
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    const accessToken = jwtUtils.createToken( jwtPayload, config.jwt_access_secret, config.jwt_access_expiration as SignOptions )

    const refreshToken = jwtUtils.createToken( jwtPayload, config.jwt_refresh_secret, config.jwt_refresh_expiration as SignOptions )
    
    
    return { accessToken, refreshToken };

}


export const authService = {
    loginUser,
}