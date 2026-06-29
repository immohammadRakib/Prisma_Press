import cookieParser from 'cookie-parser';
import express, { Application, Request, Response } from 'express';
import config from './config';
import cors from 'cors';
import { userRoute } from './modules/user/user.route';
import { authRoutes } from './modules/auth/auth.route';
import { postRoutes } from "./modules/post/post.route";
import { commentRoutes } from "./modules/comments/comment.route";



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

app.use('/api/users', userRoute);
app.use('/api/auth', authRoutes);
app.use("/api/posts", postRoutes)
app.use("/api/comments", commentRoutes)

export default app;

