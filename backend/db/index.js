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
import jwt from 'jsonwebtoken';
import { DBError } from './customErrors/DBError.js';

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

app.use(json({ limit: 5200000 }));
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
        credentials: true 
    },
    cookie: {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "Strict"
    }
});

io.use((socket, next) => {
    const cookies = socket.handshake.headers.cookie;
    const jwtToken = cookies && cookies.split(';').find(cookie => cookie.trim().startsWith("access_token="));
    const accessToken = jwtToken && jwtToken.split('=')[1];

    if (!accessToken) {
        next();
        return;
    }

    try {
        const { iat, exp, ...data } = jwt.verify(accessToken, env.JWT_SECRET_KEY);
        socket.userData = data;
        next();
    }
    catch (_) {
        next(new DBError("Token is invalid or has expired.", 401));
    }
});

io.on("connection", (socket) => {
    socket.on("send-message", (message, groupID, from, updateMessage, cb) => {
        io.sockets.in(groupID).emit("receive-message", message, groupID, from, updateMessage);
        if (cb) cb();
    });

    socket.on("join-message-group", (groupID) => {
        socket.join(groupID);
    });

    socket.on("typing-message", (username, groupID) => {
        socket.to(groupID).emit("user-typing", username, groupID);
    });

    socket.on("leave-room", (userID, groupID) => {
        socket.to(groupID).emit("left-room", userID, groupID);
    });

    socket.on("added-to-group", (socketID, group) => {
        io.sockets.in(socketID).emit("new-group", group);
    });

    socket.on("update-members", (members, groupID) => {
        io.sockets.in(groupID).emit("show-updated-members", members, groupID);
    });

    socket.on("update-user-status", (username, status) => {
        io.emit("show-user-status", username, status);
    });

    socket.on("leave-rooms", () => {
        for (const room of socket.rooms) {
            if (room !== socket.id) {
                socket.leave(room);
            }
        }
    });

    socket.on("disconnecting", async () => {
        try {
            await prisma.user.update({
                where: { userID: socket.userData.userID },
                data: { status: "OFFLINE" }
            });

            io.emit("show-user-status", socket.userData.username, "OFFLINE");
        }
        catch (_) {
            // Ignore failure to update user's status and try again the next time they connect.
        }
    });
});

const PORT = env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});