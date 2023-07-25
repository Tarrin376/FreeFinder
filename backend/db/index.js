import express, { json } from 'express';
import userRouter from './routes/UserRouter.js';
import postRouter from './routes/PostRouter.js';
import sellerRouter from './routes/SellerRouter.js';
import sellerLevelRouter from './routes/SellerLevelRouter.js';
import jobCategoryRouter from './routes/JobCategoryRouter.js';
import reviewRouter from './routes/ReviewRouter.js';
import helpfulReviewRouter from './routes/HelpfulReviewRouter.js';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { env } from 'process';
import cookieParser from 'cookie-parser';
import pkg from 'cloudinary';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
export const cloudinary = pkg.v2;

cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_secret: env.CLOUDINARY_API_SECRET,
    api_key: env.CLOUDINARY_API_KEY
});

const app = express();
const server = http.createServer(app);
const router = express.Router();

app.use(json({ limit: 2500000 }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use('/api', router);

router.use('/users', userRouter);
router.use('/posts', postRouter);
router.use('/sellers', sellerRouter);
router.use('/seller-levels', sellerLevelRouter);
router.use('/job-categories', jobCategoryRouter);
router.use('/reviews', reviewRouter);
router.use('/helpful-reviews', helpfulReviewRouter);

const io = new SocketIOServer(server, {
    cors: {
        origin: ["http://localhost:3000"],
    }
});

io.on("connection", (socket) => {
    socket.on("send-message", (message, groupID) => {
        socket.to(groupID).emit("receive-message", message, groupID);
    });

    socket.on("join-message-group", (groupID) => {
        socket.join(groupID);
    });

    socket.on("typing-message", (username, groupID) => {
        socket.to(groupID).emit("user-typing", username, groupID);
    });

    socket.on("disconnect", () => {
        console.log("disconnected");
    });
});

const PORT = env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});