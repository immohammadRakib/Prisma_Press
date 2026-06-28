import { Router, Request, Response } from "express"; 
import httpStatus from "http-status";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";




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


const registerUser = catchAsync( async (req: Request, res: Response, next: Function) => {
    const payload = req.body;

    const user  = await userService.registerUserIntoDB(payload);

    res.status(httpStatus.CREATED).json({
        message: 'User registered successfully',
        data: {
            user
        }
    });
});


export const userController = {
    registerUser
}