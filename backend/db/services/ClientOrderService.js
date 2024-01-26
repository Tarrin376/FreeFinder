import { Prisma } from '@prisma/client';
import { DBError } from '../customErrors/DBError.js';
import { prisma } from '../index.js';
import { getPaginatedData } from '../utils/getPaginatedData.js';

export async function getClientOrdersHandler(req) {
    try {
        const user = await prisma.seller.findUnique({ 
            where: { sellerID: req.sellerID },
            select: { userID: true }
        });

        if (req.userData.userID !== user.userID) {
            throw new DBError("You are not authorized to perform this action.", 403);
        }

        const where = {
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
                    country: true
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
        } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            throw new DBError("Seller not found.", 404);
        } else {
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}