import { Prisma } from '@prisma/client';
import { prisma } from '../index.js';
import { DBError } from '../customErrors/DBError.js';
import { getPaginatedData } from '../utils/getPaginatedData.js';
import { checkUser } from '../utils/checkUser.js';
import { messageProperties } from '../utils/messageProperties.js';

export async function getMessagesHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        const where = { groupID: req.groupID };

        const options = {
            orderBy: { createdAt: 'desc' }
        };

        const select = messageProperties;
        const result = await getPaginatedData(
            where, 
            select, 
            "message", 
            req.body.limit, 
            { messageID: req.body.cursor }, 
            "messageID", 
            options
        );

        return {
            ...result,
            next: result.next.map(message => {
                if (message.orderRequest) {
                    message.orderRequest.subTotal = parseFloat(message.orderRequest.subTotal);
                    message.orderRequest.total = parseFloat(message.orderRequest.total);
                }

                return message;
            })
        }
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else {
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function sendMessageHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);

        return await prisma.$transaction(async (tx) => {
            const newMessage = await tx.message.create({
                data: {
                    fromID: req.userData.userID,
                    groupID: req.groupID,
                    messageText: req.body.message
                },
                select: {
                    ...messageProperties
                }
            });
    
            await tx.groupMember.updateMany({
                where: { groupID: req.groupID },
                data: {
                    unreadMessages: {
                        increment: 1
                    }
                }
            });
    
            const members = await prisma.groupMember.findMany({
                where: { groupID: req.groupID },
                select: { userID: true }
            });
    
            for (const member of members) {
                await tx.user.update({
                    where: { userID: member.userID },
                    data: {
                        unreadMessages: {
                            increment: 1
                        }
                    }
                });
            }
    
            return newMessage;
        });
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