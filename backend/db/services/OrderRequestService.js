import { OrderStatus, Prisma } from '@prisma/client';
import { DBError } from '../customErrors/DBError.js';
import { checkUser } from '../utils/checkUser.js';
import { prisma } from '../index.js';
import { messageProperties } from '../utils/messageProperties.js';
import { SERVICE_FEE, VALID_DURATION_DAYS } from '@freefinder/shared/dist/constants.js';
import { notificationProperties } from '../utils/notificationProperties.js';

const FIRST_ORDER_REQ_XP = 100;

export async function createOrderHandler(req, tx) {
    try {
        const orderRequest = await tx.orderRequest.findUnique({
            where: { id: req.params.id },
            select: { 
                status: true,
                sellerID: true,
                total: true,
                subTotal: true,
                packageID: true,
                userID: true,
                sellerID: true,
                seller: {
                    select: {
                        userID: true
                    }
                },
                package: {
                    select: {
                        deliveryTime: true
                    }
                }
            }
        });

        if (!orderRequest) {
            throw new DBError("Order request not found.", 404);
        } else if (orderRequest.seller.userID !== req.userData.userID) {
            throw new DBError("You are not authorized to accept this order request.", 403);
        } else if (orderRequest.status !== "PENDING") {
            throw new DBError("Action has already been taken on this order request.", 409);
        }

        const date = new Date();
        const deliveryEndDate = new Date(date.setDate(date.getDate() + orderRequest.package.deliveryTime));

        await tx.order.create({
            data: {
                clientID: orderRequest.userID,
                sellerID: orderRequest.sellerID,
                status: "ACTIVE",
                total: orderRequest.total,
                subTotal: orderRequest.subTotal,
                packageID: orderRequest.packageID,
                deliveryEndDate: deliveryEndDate
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
}

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
        throw new DBError("You must message the seller about this service before requesting an order.", 400);
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
            postID: true,
            post: {
                select: {
                    sellerID: true,
                    hidden: true
                }
            }
        }
    });

    if (!pkg) {
        throw new DBError("Service or package does not exist.", 404);
    } else if (pkg.post.sellerID !== sellerID) {
        throw new DBError("This seller does not own this service.", 400);
    } else if (pkg.post.hidden) {
        throw new DBError("You cannot request an order for a hidden service.", 403);
    }

    return {
        pkg: pkg,
        subTotal: parseFloat(pkg.amount)
    };
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
            select: { 
                sellerID: true,
                hadFirstOrderRequest: true,
                user: {
                    select: {
                        notificationSettings: true,
                        socketID: true
                    }
                }
            }
        });

        if (!seller) {
            throw new DBError("Seller does not exist.", 400);
        }

        const user = await checkUser(req.userData.userID, req.username);
        const groupID = await checkMessageGroup(req.params.postID, req.userData.userID);
        const { pkg, subTotal } = await checkPackage(req.params.postID, req.params.packageType, seller.sellerID);

        const userBalance = parseFloat(user.balance);
        const total = subTotal + subTotal * SERVICE_FEE;

        if (total > userBalance) {
            throw new DBError(`You are £${(total - userBalance).toFixed(2)} short! Please top up your balance to make this order request.`, 400);
        }

        await checkOrderRequests(pkg.packageID, req.userData.userID);
        const members = await prisma.groupMember.findMany({
            where: { groupID: groupID },
            select: {
                userID: true,
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
                    packageID: pkg.packageID,
                    status: "PENDING",
                    expires: expiryDate,
                    subTotal: subTotal,
                    total: total
                }
            });

            await tx.groupMember.updateMany({
                where: { groupID: message.groupID },
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

            await tx.user.update({
                where: { userID: req.userData.userID },
                data: {
                    balance: { decrement: total }
                }
            });

            orderRequest.subTotal = parseFloat(orderRequest.subTotal);
            orderRequest.total = parseFloat(orderRequest.total);

            let firstOrderRequest = undefined;
            if (!seller.hadFirstOrderRequest) {
                await tx.seller.update({
                    where: { userID: req.params.seller },
                    data: { 
                        hadFirstOrderRequest: true,
                        sellerXP: { increment: FIRST_ORDER_REQ_XP }
                    }
                });

                if (seller.user.notificationSettings.rewards !== false) {
                    const notification = await tx.notification.create({
                        select: notificationProperties,
                        data: {
                            userID: req.params.seller,
                            title: `Congrats on your first order request!`,
                            text: `You received your first order request from ${req.userData.username}. Keep it up!`,
                            xp: FIRST_ORDER_REQ_XP
                        }
                    });

                    await tx.user.update({
                        where: { userID: req.params.seller },
                        data: {
                            unreadNotifications: { increment: 1 }
                        }
                    });

                    firstOrderRequest = {
                        socketID: seller.user.socketID,
                        notification: notification
                    }
                }
            }

            const result = {
                newMessage: {
                    ...message,
                    orderRequest: orderRequest,
                },
                sockets: members.map((member) => member.user.socketID).filter((socket) => socket != null)
            };
            
            if (seller.user.notificationSettings.orders !== false) {
                const notification = await tx.notification.create({
                    select: notificationProperties,
                    data: {
                        userID: req.params.seller,
                        title: `New order request`,
                        text: `${req.userData.username} has requested a ${req.params.packageType.toLowerCase()} package order for the service: ${pkg.postID}.`,
                    }
                });

                await tx.user.update({
                    where: { userID: req.params.seller },
                    data: {
                        unreadNotifications: { increment: 1 }
                    }
                });

                return {
                    ...result,
                    firstOrderRequest: firstOrderRequest,
                    notify: {
                        socketID: seller.user.socketID,
                        notification: notification
                    }
                };
            }

            return {
                ...result,
                firstOrderRequest: firstOrderRequest
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

function getNotificationMessage(status, seller, user, packageType, postID) {
    switch (status) {
        case "ACCEPTED":
            return {
                title: "Order request accepted",
                text: `${seller} accepted your ${packageType.toLowerCase()} package order request for the service: ${postID}.`
            };
        case "DECLINED":
            return {
                title: "Order request declined",
                text: `${seller} declined your ${packageType.toLowerCase()} package order request for the service: ${postID}.`
            };
        case "CANCELLED":
            return {
                title: "Order request cancelled",
                text: `${user} cancelled their ${packageType.toLowerCase()} package order request for the service: ${postID}.` 
            };
        default:
            throw new DBError(`Unknown order request status: ${status}.`, 400);
    }
}

async function getOrderRequest(orderRequestID) {
    const orderRequest = await prisma.orderRequest.findUnique({
        where: { id: orderRequestID },
        select: { 
            id: true,
            userID: true,
            user: {
                select: {
                    username: true,
                    notificationSettings: true,
                    socketID: true
                }
            },
            messageID: true,
            package: {
                select: { 
                    postID: true,
                    type: true
                }
            },
            status: true,
            seller: {
                select: { 
                    user: { 
                        select: {
                            username: true,
                            userID: true,
                            notificationSettings: true,
                            socketID: true
                        }
                    }
                }
            }
        }
    });

    return orderRequest;
}

export async function updateOrderRequestStatusHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        const orderRequest = await getOrderRequest(req.params.id);

        if (req.userData.userID !== orderRequest.seller.user.userID && req.userData.userID !== orderRequest.userID) {
            throw new DBError("You are not authorized to update this order request.", 403);
        } else if (!orderRequest) {
            throw new DBError("Order request not found.", 404);
        } else if (orderRequest.status !== "PENDING") {
            throw new DBError("Action has already been taken on this order request.", 409);
        } else if (req.body.status === "PENDING") {
            throw new DBError("You cannot set the order request status to 'pending'.", 400);
        } else if (req.body.status === "CANCELLED" && req.userData.userID === orderRequest.seller.user.userID) {
            throw new DBError("You cannot cancel your client's order request.", 400);
        } else if (req.body.status !== "CANCELLED" && req.userData.userID === orderRequest.userID) {
            throw new DBError("You cannot accept or decline your own order request.", 400);
        }

        const message = await prisma.message.findUnique({
            where: { messageID: orderRequest.messageID },
            select: { ...messageProperties }
        });

        const members = await prisma.groupMember.findMany({
            where: { groupID: message.groupID },
            select: {
                userID: true,
                user: { 
                    select: { socketID: true }
                }
            }
        });

        return await prisma.$transaction(async (tx) => {
            if (req.body.status === "ACCEPTED") {
                await createOrderHandler(req, tx);
            }

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

            await tx.groupMember.updateMany({
                where: { groupID: message.groupID },
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

            const notificationMessage = getNotificationMessage(
                req.body.status, 
                orderRequest.seller.user.username, 
                orderRequest.user.username,
                orderRequest.package.type,
                orderRequest.package.postID
            );

            updatedOrderRequest.subTotal = parseFloat(updatedOrderRequest.subTotal);
            updatedOrderRequest.total = parseFloat(updatedOrderRequest.total);

            const result = {
                updatedMessage: {
                    ...message,
                    orderRequest: updatedOrderRequest
                },
                sockets: members.map((member) => member.user.socketID).filter((socket) => socket != null) 
            };
            
            if ((req.body.status === "CANCELLED" && orderRequest.seller.user.notificationSettings.orders !== false) || 
            (req.body.status !== "CANCELLED" && orderRequest.user.notificationSettings.orders !== false)) {
                const userID = req.body.status === "CANCELLED" ? orderRequest.seller.user.userID : orderRequest.userID;
                const socketID = req.body.status === "CANCELLED" ? orderRequest.seller.user.socketID : orderRequest.user.socketID;

                const notification = await tx.notification.create({
                    select: notificationProperties,
                    data: {
                        ...notificationMessage,
                        userID: userID,
                        navigateTo: `/${userID}/${userID === orderRequest.userID ? "my-orders" : "client-orders"}/`
                    }
                });

                await tx.user.update({
                    where: { userID: userID },
                    data: {
                        unreadNotifications: { increment: 1 }
                    }
                });

                return {
                    ...result,
                    notify: {
                        notification: notification,
                        socketID: socketID
                    }
                };
            }

            return result;
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