import { Prisma } from '@prisma/client';
import { DBError } from '../customErrors/DBError.js';
import { checkUser } from '../utils/checkUser.js';
import { prisma } from '../index.js';
import { messageProperties } from '../utils/messageProperties.js';

async function checkMessageGroup(postID, userID) {
    const messageGroup = await prisma.messageGroup.findUnique({
        where: {
            postID_creatorID: {
                postID: postID,
                creatorID: userID
            }
        },
        select: {
            groupID: true
        }
    });

    if (!messageGroup) {
        throw new DBError("You must message the seller before making an order request.", 400);
    }

    return messageGroup.groupID;
}

async function checkPackage(postID, type) {
    const packageType = await prisma.package.findUnique({
        where: {
            postID_type: {
                postID: postID,
                type: type
            }
        },
        select: {
            packageID: true
        }
    });

    if (!packageType) {
        throw new DBError("Service or package does not exist.", 404);
    }

    return packageType.packageID;
}

async function checkOrderRequests(packageID, userID) {
    const orderRequest = await prisma.orderRequest.findFirst({
        where: {
            packageID: packageID,
            userID: userID,
            status: "PENDING"
        }
    });

    if (orderRequest) {
        throw new DBError("You already have a pending order request for this package.", 400);
    }
}

export async function sendOrderRequestHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        const groupID = await checkMessageGroup(req.params.postID, req.userData.userID);
        const packageID = await checkPackage(req.params.postID, req.params.packageType);
        await checkOrderRequests(packageID, req.userData.userID);

        return await prisma.$transaction(async (tx) => {
            const message = await tx.message.create({
                select: { ...messageProperties },
                data: {
                    fromID: req.userData.userID,
                    groupID: groupID,
                    messageText: `${req.username} has requested an order.`
                }
            });
    
            const orderRequest = await tx.orderRequest.create({
                select: { ...messageProperties.orderRequest.select },
                data: {
                    messageID: message.messageID,
                    userID: req.userData.userID,
                    packageID: packageID,
                    status: "PENDING"
                }
            });

            orderRequest.package.amount = parseInt(orderRequest.package.amount);
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
        } else {
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function updateOrderRequestStatusHandler(req) {
    try {
        const orderRequest = await prisma.orderRequest.findUnique({
            where: { id: req.params.id }
        });

        if (!orderRequest) {
            throw new DBError("Order request not found.", 404);
        } else if (orderRequest.status !== "PENDING") {
            throw new DBError("Action has already been taken on this order request.", 409);
        }

        const message = await prisma.message.findUnique({
            where: { messageID: orderRequest.messageID },
            select: { ...messageProperties }
        });

        const updatedOrderRequest = await prisma.orderRequest.update({
            select: { ...messageProperties.orderRequest.select },
            where: { id: req.params.id },
            data: { 
                status: req.body.status,
                actionTaken: new Date()
            },
        });

        updatedOrderRequest.package.amount = parseInt(updatedOrderRequest.package.amount);
        return {
            ...message,
            orderRequest: updatedOrderRequest
        }
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            throw new DBError("Order request not found.", 404);
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