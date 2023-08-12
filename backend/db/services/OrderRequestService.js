import { Prisma } from '@prisma/client';
import { DBError } from '../customErrors/DBError.js';
import { checkUser } from '../utils/checkUser.js';
import { prisma } from '../index.js';
import { messageProperties } from '../utils/messageProperties.js';
import { SERVICE_FEE, VALID_DURATION_DAYS } from '@freefinder/shared/dist/constants.js';

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
        throw new DBError("You must message the seller about this service before performing this action.", 400);
    }

    return messageGroup.groupID;
}

async function checkPackage(postID, type, sellerID) {
    const pkg = await prisma.package.findUnique({
        where: {
            postID_type: {
                postID: postID,
                type: type
            }
        },
        select: {
            packageID: true,
            amount: true,
            post: {
                select: {
                    sellerID: true
                }
            }
        }
    });

    if (!pkg) {
        throw new DBError("Service or package does not exist.", 404);
    }

    if (pkg.post.sellerID !== sellerID) {
        throw new DBError("This seller does not own this service.", 400);
    }

    return {
        packageID: pkg.packageID,
        subTotal: parseFloat(pkg.amount)
    }
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
        const seller = await prisma.seller.findUnique({
            where: { userID: req.params.seller },
            select: { sellerID: true }
        });

        if (!seller) {
            throw new DBError("Seller does not exist.", 400);
        }

        const user = await checkUser(req.userData.userID, req.username);
        const groupID = await checkMessageGroup(req.params.postID, req.userData.userID);
        const { packageID, subTotal } = await checkPackage(req.params.postID, req.params.packageType, seller.sellerID);

        const userBalance = parseFloat(user.balance);
        const total = subTotal + subTotal * SERVICE_FEE;

        if (total > userBalance) {
            throw new DBError(`You are £${(total - userBalance).toFixed(2)} short! Please top up your balance to make this order request.`, 400);
        }

        await checkOrderRequests(packageID, req.userData.userID);
        const members = await prisma.groupMember.findMany({
            where: { groupID: groupID },
            select: {
                user: { 
                    select: { socketID: true }
                }
            }
        });

        return await prisma.$transaction(async (tx) => {
            const message = await tx.message.create({
                select: { ...messageProperties },
                data: {
                    fromID: req.userData.userID,
                    groupID: groupID,
                    messageText: `${req.username} has requested an order.`
                }
            });
            
            const date = new Date();
            const expiryDate = new Date(date.setDate(date.getDate() + VALID_DURATION_DAYS));

            const orderRequest = await tx.orderRequest.create({
                select: { ...messageProperties.orderRequest.select },
                data: {
                    messageID: message.messageID,
                    userID: req.userData.userID,
                    sellerID: seller.sellerID,
                    packageID: packageID,
                    status: "PENDING",
                    expires: expiryDate,
                    subTotal: subTotal,
                    total: total
                }
            });

            await tx.user.update({
                where: { userID: req.userData.userID },
                data: {
                    balance: { decrement: total }
                }
            });

            orderRequest.subTotal = parseFloat(orderRequest.subTotal);
            orderRequest.total = parseFloat(orderRequest.total);

            return {
                newMessage: {
                    ...message,
                    orderRequest: orderRequest,
                },
                sockets: members.map((member) => member.user.socketID).filter((socket) => socket !== null)
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
        await checkUser(req.userData.userID, req.username);
        const orderRequest = await prisma.orderRequest.findUnique({
            where: { id: req.params.id },
            select: { 
                userID: true,
                messageID: true,
                package: {
                    select: { postID: true }
                },
                status: true,
                seller: {
                    select: { userID: true }
                }
            }
        });

        if (req.userData.userID !== orderRequest.userID && req.userData.userID !== orderRequest.seller.userID) {
            throw new DBError("You are not authorized to update this order request.", 403);
        } else if (!orderRequest) {
            throw new DBError("Order request not found.", 404);
        } else if (orderRequest.status !== "PENDING") {
            throw new DBError("Action has already been taken on this order request.", 409);
        } else if (req.body.status === "PENDING") {
            throw new DBError("You cannot set the order request status to 'pending'.", 400);
        }

        const message = await prisma.message.findUnique({
            where: { messageID: orderRequest.messageID },
            select: { ...messageProperties }
        });

        const members = await prisma.groupMember.findMany({
            where: { groupID: message.groupID },
            select: {
                user: { 
                    select: { socketID: true }
                }
            }
        });

        return await prisma.$transaction(async (tx) => {
            const updatedOrderRequest = await tx.orderRequest.update({
                select: { ...messageProperties.orderRequest.select },
                where: { id: req.params.id },
                data: { 
                    status: req.body.status,
                    actionTaken: new Date()
                },
            });

            if (req.body.status !== "ACCEPTED") {
                await tx.user.update({
                    where: { userID: orderRequest.userID },
                    data: {
                        balance: { increment: updatedOrderRequest.total }
                    }
                });
            }
    
            updatedOrderRequest.subTotal = parseFloat(updatedOrderRequest.subTotal);
            updatedOrderRequest.total = parseFloat(updatedOrderRequest.total);

            return {
                updatedMessage: {
                    ...message,
                    orderRequest: updatedOrderRequest
                },
                sockets: members.map((member) => member.user.socketID).filter((socket) => socket !== null) 
            }
        });
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
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