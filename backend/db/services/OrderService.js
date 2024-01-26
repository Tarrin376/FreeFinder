import { Prisma } from '@prisma/client';
import { DBError } from '../customErrors/DBError.js';
import { checkUser } from '../utils/checkUser.js';
import { prisma } from '../index.js';
import { getPaginatedData } from '../utils/getPaginatedData.js';

export async function createOrderHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        const orderRequest = await prisma.orderRequest.findUnique({
            where: { id: req.body.orderRequestID },
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

        await prisma.$transaction([
            prisma.orderRequest.update({
                where: { id: req.body.orderRequestID },
                data: { status: "ACCEPTED" }
            }),
            prisma.order.create({
                data: {
                    clientID: orderRequest.userID,
                    sellerID: orderRequest.sellerID,
                    status: "PENDING",
                    total: orderRequest.total,
                    subTotal: orderRequest.subTotal,
                    packageID: orderRequest.packageID,
                    deliveryEndDate: deliveryEndDate
                }
            })
        ]);
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

export async function getOrdersHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        const where = {
            clientID: req.userData.userID
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
                            country: true
                        }
                    }
                }
            },
            package: {
                select: {
                    type: true,
                    post: {
                        select: {
                            title: true,
                            postID: true
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