import { Prisma } from '@prisma/client';
import { DBError } from '../customErrors/DBError.js';
import { checkUser } from '../utils/checkUser.js';
import { prisma } from '../index.js';
import { messageProperties } from '../utils/messageProperties.js';

export async function sendOrderRequestHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        const packageType = await prisma.package.findUnique({
            where: {
                postID_type: {
                    postID: req.params.postID,
                    type: req.params.packageType
                }
            }
        });

        if (!packageType) {
            throw new DBError("Service or package does not exist.", 404);
        }

        const messageGroup = await prisma.messageGroup.findUnique({
            where: {
                postID_creatorID: {
                    postID: req.params.postID,
                    creatorID: req.userData.userID
                }
            }
        });

        if (!messageGroup) {
            throw new DBError("You must message the seller before making an order request.", 400);
        }

        return await prisma.$transaction(async (tx) => {
            const message = await tx.message.create({
                data: {
                    fromID: req.userData.userID,
                    groupID: messageGroup.groupID,
                    messageText: `${req.username} has requested an order.`
                },
                select: {
                    ...messageProperties
                }
            });
    
            const orderRequest = await tx.orderRequest.create({
                data: {
                    messageID: message.messageID,
                    userID: req.userData.userID,
                    packageID: packageType.packageID
                },
                select: {
                    package: {
                        select: {
                            ...messageProperties.orderRequest.select.package.select
                        }
                    }
                }
            });

            return {
                ...message,
                orderRequest: orderRequest
            }
        });
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
            throw new DBError("You have already made an order request for this package.", 409);
        } else {
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}