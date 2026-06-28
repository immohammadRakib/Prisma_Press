import { threadCpuUsage } from "node:process";
import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth.interface"
import { error } from "node:console";
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

    return user;

}


export const authService = {
    loginUser,
}