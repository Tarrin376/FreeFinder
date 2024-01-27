import { Prisma } from '@prisma/client';
import { DBError } from '../customErrors/DBError.js';
import { checkUser } from '../utils/checkUser.js';
import { prisma } from '../index.js';
import { getPaginatedData } from '../utils/getPaginatedData.js';

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