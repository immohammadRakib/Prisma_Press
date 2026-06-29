import { Router, Request, Response, NextFunction } from "express";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { Role } from "../../../generated/prisma/enums";
import httpStatus from "http-status";




const router = Router();


declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string,
                name: string,
                email: string,
                role: Role
            }
        }
    }
}



router.post('/register', userController.registerUser)
router.get('/me', (req: Request, res: Response, next: NextFunction) => {
    console.log(req.cookies)

    const { accessToken } = req.cookies
    const verifiedToken = jwtUtils.verifyToken( accessToken, config.jwt_access_secret)
    if( typeof verifiedToken === 'string' ){
        throw new Error( verifiedToken )
    }

    const { name, email, id, role } = verifiedToken;
    const requiredRole = [ Role.ADMIN, Role.AUTHOR, Role.USER ]
    if( !requiredRole.includes(role) ) {
        return res.status(403).json({
            success: false,
            statusCode: httpStatus.FORBIDDEN,
            message: "Forbidden, you don't have permission to have this resource"
        })
    }

    req.user = {
        id,
        name,
        email,
        role
    }


    next();
}, userController.getMyProfile)


export const userRoute = router;