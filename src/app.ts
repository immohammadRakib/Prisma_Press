import cookieParser from 'cookie-parser';
import express, { Application, Request, Response } from 'express';
import config from './config';
import cors from 'cors';
import httpStatus from 'http-status';
import { prisma } from './lib/prisma';
import bcrypt from 'bcryptjs';


const app : Application = express();

app.use(cors({
    origin: config.app_url,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.get('/', (req: Request, res: Response) => {
     res.send('Hello, World!');
});

app.post('/api/users/register', async (req: Request, res: Response) => {
     const { name, email, password, profilePhoto } = req.body;

     const userExists = await prisma.user.findUnique({ where: { email } }); 
     if (userExists) {
          return res.status(httpStatus.CONFLICT).json({ message: 'User already exists' });
     }
     
     const hashedPassword = await bcrypt.hash(password, Number(config.bcryptSaltRounds));
     
     const newUser = await prisma.user.create({
          data: {
               name,
               email,
               password: hashedPassword
          }
     });

    await prisma.profile.create({
        data: {
                userId: newUser.id,
                profilePhoto
        }
     })

    const user = await prisma.user.findUnique({
        where: {
            id: newUser.id,
            email: newUser.email || email
        },
        omit: {
            password: true
        },
        include: {
            profileId: true
        }
    })


    res.status(httpStatus.CREATED).json({ 
    message: 'User registered successfully',
    data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
    }
});

})


export default app;

