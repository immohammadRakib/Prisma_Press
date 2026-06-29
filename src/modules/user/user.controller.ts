import { Router, Request, Response } from "express"; 
import httpStatus from "http-status";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";



// const registerUser = async (req: Request, res: Response) => {
//     try{
//         const payload = req.body;
    
//         const user  = await userService.registerUserIntoDB(payload);
     
//         res.status(httpStatus.CREATED).json({ 
//         message: 'User registered successfully',
//         data: {
//             user
//         }

// })
//     } catch (error) {
//         res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//             message: 'Error registering user',
//             error: (error as Error).message
//         });
//     }
// }


const registerUser = catchAsync( async ( req: Request, res: Response, next: Function ) => {
    const payload = req.body;

    const user  = await userService.registerUserIntoDB(payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User registered successfully",
        data: { user }
    })
});


const getMyProfile = catchAsync( async ( req: Request, res: Response, next: Function ) => {
    const { accessToken } = req.cookies

    
    const verifiedToken = jwtUtils.verifyToken( accessToken, config.jwt_access_secret)
 
    if( typeof verifiedToken === 'string' ){
        throw new Error( verifiedToken )
    }

    const profile = await userService.getMyProfileIntoDB(verifiedToken.id)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User registered successfully",
        data: { profile }
    })
})

export const userController = {
    registerUser,
    getMyProfile
}