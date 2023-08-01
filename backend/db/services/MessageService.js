import { Prisma } from '@prisma/client';
import { prisma } from '../index.js';
import { DBError } from '../customErrors/DBError.js';
import { getPaginatedData } from '../utils/getPaginatedData.js';
import { checkUser } from '../utils/checkUser.js';

export async function getMessagesHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        const where = {
            groupID: req.groupID
        };

        const options = {
            orderBy: {
                createdAt: 'desc'
            }
        };

        const select = {
            from: {
                select: {
                    username: true,
                    profilePicURL: true,
                    status: true
                }
            },
            files: {
                select: {
                    url: true,
                    name: true,
                    fileType: true,
                    fileSize: true,
                }
            },
            messageText: true,
            createdAt: true,
            messageID: true
        };

        const result = await getPaginatedData(
            where, 
            select, 
            "message", 
            req.body.limit, 
            { messageID: req.body.cursor }, 
            "messageID", 
            options
        );

        return result;
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function sendMessageHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        const newMessage = await prisma.message.create({
            data: {
                fromID: req.userData.userID,
                groupID: req.groupID,
                messageText: req.body.message
            },
            select: {
                from: {
                    select: {
                        username: true,
                        profilePicURL: true,
                        status: true
                    }
                },
                files: {
                    select: {
                        url: true,
                        name: true,
                        fileType: true,
                        fileSize: true
                    }
                },
                messageText: true,
                createdAt: true,
                messageID: true
            }
        });

        return newMessage;
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}