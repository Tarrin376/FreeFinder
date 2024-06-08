import { Prisma } from '@prisma/client';
import { DBError } from '../customErrors/DBError.js';
import { prisma } from '../index.js';
import { getPaginatedData } from '../utils/getPaginatedData.js';
import { VALID_DURATION_DAYS } from '@freefinder/shared/dist/constants.js';

export async function getClientOrdersHandler(req) {
    try {
        const user = await prisma.seller.findUnique({ 
            where: { sellerID: req.sellerID },
            select: { userID: true }
        });
        
        if (user == null || req.userData.userID !== user.userID) {
            throw new DBError("You are not authorized to perform this action.", 403);
        }

        const where = {
            status: "ACTIVE",
            seller: {
                userID: req.userData.userID
            }
        };

        const select = {
            status: true,
            total: true,
            subTotal: true,
            deliveryEndDate: true,
            createdAt: true,
            orderID: true,
            client: {
                select: {
                    username: true,
                    status: true,
                    profilePicURL: true,
                    email: true,
                    country: true,
                    seller: {
                        select: {
                            sellerID: true
                        }
                    }
                }
            },
            package: {
                select: {
                    type: true,
                    revisions: true,
                    post: {
                        select: {
                            title: true,
                            postID: true,
                            workType: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                }
            }
        };

        const cursor = req.body.cursor ? { 
            orderID: req.body.cursor
        } : {};

        const orders = await getPaginatedData(
            where, 
            select, 
            "order", 
            req.body.limit, 
            cursor, 
            "orderID", 
            {}
        );

        return {
            ...orders,
            next: orders.next.map((order) => {
                const { client, ...rest } = order;
                return { 
                    ...rest, 
                    user: { ...client },
                    isClientOrder: true
                };
            })
        }
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

export async function cancelClientOrderHandler(req) {
    try {
        const seller = await prisma.seller.findUnique({ 
            where: { sellerID: req.sellerID },
            select: { 
                user: {
                    select: {
                        userID: true,
                        username: true
                    }
                }
            }
        });

        if (seller == null || req.userData.userID !== seller.user.userID) {
            throw new DBError("You are not authorized to perform this action.", 403);
        }

        const order = await prisma.order.findUnique({
            where: { 
                orderID: req.params.id,
            },
            select: { 
                client: {
                    select: {
                        userID: true,
                        username: true,
                        socketID: true,
                        notificationSettings: true
                    }
                },
                total: true,
                status: true,
                package: {
                    select: {
                        type: true,
                        postID: true
                    }
                }
            }
        });

        if (order == null) {
            throw new DBError("Order not found.", 404);
        }

        return await prisma.$transaction(async (tx) => {
            if (order.status !== "ACTIVE") {
                throw new DBError("Action has already been taken on this order.", 400);
            }

            await tx.user.update({
                where: { userID: order.client.userID },
                data: {
                    balance: { increment: order.total }
                }
            });

            await tx.order.update({
                where: { orderID: req.params.id },
                data: { status: "CANCELLED" }
            });
            
            if (order.client.notificationSettings.orders) {
                const notification = await tx.notification.create({
                    data: {
                        userID: order.client.userID,
                        title: "Order cancellation",
                        text: `${seller.user.username} cancelled your ${order.package.type.toLowerCase()} package order for the service: ${order.package.postID}.`,
                        navigateTo: `/${order.client.username}/orders`
                    }
                });

                await tx.user.update({
                    where: { userID: order.client.userID },
                    data: {
                        unreadNotifications: { increment: 1 }
                    }
                });
    
                return {
                    notification: notification,
                    socketID: order.client.socketID
                }
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

export async function sendCompleteOrderRequestHandler(req) {
    try {
        const seller = await prisma.seller.findUnique({ 
            where: { sellerID: req.sellerID },
            select: { 
                user: {
                    select: {
                        userID: true,
                        username: true
                    }
                }
            }
        });

        const order = await prisma.order.findUnique({
            where: { orderID: req.params.id },
            select: {
                sellerID: true,
                client: {
                    select: {
                        notificationSettings: true,
                        userID: true
                    }
                },
                package: {
                    select: {
                        postID: true
                    }
                }
            }
        });

        if (order == null) {
            throw new DBError("Order not found.", 404);
        } else if (seller == null || req.userData.userID != seller.user.userID || order.sellerID !== req.sellerID) {
            throw new DBError("You do not have authorization to perform this action.", 403);
        }

        const completedOrderRequest = await prisma.completeOrderRequest.findFirst({
            where: {
                orderID: req.params.id,
                status: "PENDING"
            }
        });

        if (completedOrderRequest != null) {
            throw new DBError("You currently have a pending request. Please wait until the request expires or is declined by the client.", 400);
        }

        const messageGroup = await prisma.messageGroup.findUnique({
            where: {
                postID_creatorID: {
                    postID: order.package.postID,
                    creatorID: order.client.userID
                }
            },
            select: {
                groupID: true,
                members: {
                    select: {
                        userID: true
                    }
                }
            }
        });

        if (messageGroup == null) {
            throw new DBError("Message group not found.", 404);
        }

        await prisma.$transaction(async (tx) => {
            const date = new Date();
            const expiryDate = new Date(date.setDate(date.getDate() + VALID_DURATION_DAYS));

            await tx.message.create({
                data: {
                    fromID: seller.user.userID,
                    messageText: `The seller has opened a request to complete your order.`,
                    groupID: messageGroup.groupID,
                    completeOrderRequest: {
                        create: {
                            orderID: req.params.id,
                            status: "PENDING",
                            expires: expiryDate
                        }
                    }
                }
            });

            await tx.groupMember.updateMany({
                where: { groupID: messageGroup.groupID },
                data: {
                    unreadMessages: { increment: 1 }
                }
            });
    
            for (const member of messageGroup.members) {
                await tx.user.update({
                    where: { userID: member.userID },
                    data: {
                        unreadMessages: { increment: 1 }
                    }
                });
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

export async function updateCompleteOrderRequestHandler(req) {
    try {
        const order = await prisma.order.findUnique({
            where: { orderID: req.params.id },
            select: { 
                clientID: true,
                sellerID: true
            }
        });

        const request = await prisma.completeOrderRequest.findUnique({
            where: { id: req.params.requestID },
            select: { status: true }
        });
        
        if (order == null) {
            throw new DBError("Order does not exist.", 404);
        } else if (request == null) {
            throw new DBError("Request does not exist.", 404);
        } else if (request.status !== "PENDING") {
            throw new DBError("Action has already been taken on this request.", 400);
        } else if (order.sellerID !== req.sellerID || req.body.status !== "CANCELLED") {
            throw new DBError("You do not have authorization to perform this action.", 403);
        }

        await prisma.completeOrderRequest.update({
            where: { id: req.params.requestID },
            data: { status: req.body.status }
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