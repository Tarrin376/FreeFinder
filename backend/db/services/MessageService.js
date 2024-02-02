import { Prisma } from '@prisma/client';
import { prisma } from '../index.js';
import { DBError } from '../customErrors/DBError.js';
import { getPaginatedData } from '../utils/getPaginatedData.js';
import { checkUser } from '../utils/checkUser.js';
import { messageProperties } from '../utils/messageProperties.js';
import { notificationProperties } from '../utils/notificationProperties.js';

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
                } else if (message.completeOrderRequest) {
                    message.completeOrderRequest.order.subTotal = parseFloat(message.completeOrderRequest.order.subTotal);
                    message.completeOrderRequest.order.total = parseFloat(message.completeOrderRequest.order.total);
                }

                return message;
            })
        };
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

function getMentionedMembers(members, message) {
    const words = message.split(' ');
    const memberMap = new Map();
    const mentionedMembers = new Set();

    for (const member of members) {
        memberMap.set(member.user.username, member);
    }

    for (const word of words) {
        if (word.length > 0 && word[0] === '@') {
            const member = word.substring(1);
            if (memberMap.has(member)) {
                mentionedMembers.add(memberMap.get(member));
            }
        }
    }

    return mentionedMembers;
}

export async function sendMessageHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        const members = await prisma.groupMember.findMany({
            where: { groupID: req.groupID },
            select: { 
                userID: true,
                user: {
                    select: { 
                        socketID: true,
                        username: true,
                        notificationSettings: true
                    }
                }
            }
        });

        const group = await prisma.messageGroup.findUnique({
            where: { groupID: req.groupID },
            select: { groupName: true }
        });

        return await prisma.$transaction(async (tx) => {
            const mentionedMembers = getMentionedMembers(members, req.body.message);
            const mentioned = [];

            for (const member of mentionedMembers) {
                if (member.user.username !== req.username && member.user.notificationSettings.mentionsAndReplies !== false) {
                    const notification = await tx.notification.create({
                        select: notificationProperties,
                        data: {
                            userID: member.userID,
                            title: "You were mentioned in a chat group",
                            text: `${req.username} mentioned you ${mentionedMembers.length > 1 ? `and ${mentionedMembers.length - 1} others` : ""} 
                            in the '${group.groupName}' chat group. Check your messages to see what they said!`
                        }
                    });
    
                    await tx.user.update({
                        where: { userID: member.userID },
                        data: {
                            unreadNotifications: {
                                increment: 1
                            }
                        }
                    });
                    
                    if (member.user.socketID) {
                        mentioned.push({
                            socketID: member.user.socketID,
                            notification: notification
                        });
                    }
                }
            }

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
                    unreadMessages: { increment: 1 }
                }
            });
    
            for (const member of members) {
                await tx.user.update({
                    where: { userID: member.userID },
                    data: {
                        unreadMessages: { increment: 1 }
                    }
                });
            }
    
            return {
                newMessage: newMessage,
                sockets: members.map((member) => member.user.socketID).filter((socket) => socket != null),
                mentioned: mentioned
            };
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