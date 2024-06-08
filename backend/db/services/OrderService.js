import { Prisma } from '@prisma/client';
import { DBError } from '../customErrors/DBError.js';
import { checkUser } from '../utils/checkUser.js';
import { prisma } from '../index.js';
import { getPaginatedData } from '../utils/getPaginatedData.js';
import { giveSellerXP } from '../utils/giveSellerXP.js';

export async function getOrdersHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        const where = {
            clientID: req.userData.userID,
            status: "ACTIVE"
        };

        const select = {
            status: true,
            total: true,
            subTotal: true,
            deliveryEndDate: true,
            createdAt: true,
            orderID: true,
            seller: {
                select: {
                    user: {
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
                const { seller: { user }, ...rest } = order;
                return { 
                    ...rest, 
                    user, 
                    isClientOrder: false
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

function getNotificationMessage(status, user, orderID) {
    switch (status) {
        case "ACCEPTED":
            return {
                title: "Request to complete order accepted",
                text: `${user} accepted your request to complete the order: ${orderID}.`
            };
        case "DECLINED":
            return {
                title: "Request to complete order declined",
                text: `${user} declined your request to complete the order: ${orderID}.`
            };
        default:
            throw new DBError(`Unknown order request status: ${status}.`, 400);
    }
}

export async function updateCompleteOrderRequestHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        const order = await prisma.order.findUnique({
            where: { orderID: req.params.id },
            select: { 
                clientID: true,
                sellerID: true,
                subTotal: true,
                seller: {
                    select: {
                        user: {
                            select: {
                                notificationSettings: true,
                                userID: true,
                                socketID: true
                            }
                        }
                    }
                }
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
        } else if (order.clientID !== req.userData.userID) {
            throw new DBError("You do not have authorization to perform this action.", 403);
        } else if ((req.body.status !== "ACCEPTED" && req.body.status !== "DECLINED")) {
            throw new DBError("Invalid order status provided.", 400);
        }

        const notificationMessage = getNotificationMessage(req.body.status, req.username, req.params.id);
        return await prisma.$transaction(async (tx) => {
            await tx.completeOrderRequest.update({
                where: { id: req.params.requestID },
                data: { status: req.body.status }
            });
    
            if (req.body.status === "ACCEPTED") {
                await tx.order.update({
                    where: { orderID: req.params.id },
                    data: { status: "COMPLETED" }
                });

                await tx.user.update({
                    where: { userID: order.seller.user.userID },
                    data: {
                        balance: { increment: order.subTotal }
                    }
                });
    
                await giveSellerXP(order.sellerID, 50, tx);
            }

            if (order.seller.user.notificationSettings.orders !== false) {
                const notification = await tx.notification.create({
                    data: {
                        ...notificationMessage,
                        userID: order.seller.user.userID
                    }
                });

                await tx.user.update({
                    where: { userID: order.seller.user.userID },
                    data: {
                        unreadNotifications: { increment: 1 }
                    }
                });

                return {
                    notify: {
                        notification: notification,
                        socketID: order.seller.user.socketID
                    }
                }
            }

            return {};
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