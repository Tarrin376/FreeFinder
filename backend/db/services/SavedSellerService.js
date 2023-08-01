import { prisma } from '../index.js';
import { Prisma } from '@prisma/client';
import { DBError } from "../customErrors/DBError.js";
import { checkUser } from "../utils/checkUser.js";
import { getPaginatedData } from '../utils/getPaginatedData.js';

export async function saveSellerHandler(sellerID, userID, username) {
    try {
        await checkUser(userID, username);
        await prisma.savedSeller.create({
            data: {
                userID: userID,
                sellerID: sellerID
            }
        });
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
            // Ignore that the seller has already been saved by the user.
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        }  else {
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function deleteSavedSellerHandler(sellerID, userID, username) {
    try {
        await checkUser(userID, username);
        await prisma.savedSeller.delete({
            where: {
                userID_sellerID: {
                    userID: userID,
                    sellerID: sellerID
                }
            }
        });
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            throw new DBError("This seller is not in your saved list.", 404);
        } else {
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function getSavedSellersHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        const where = {
            userID: req.userData.userID
        };

        const select = {
            seller: {
                select: {
                    user: {
                        select: {
                            username: true,
                            profilePicURL: true,
                            country: true,
                            status: true,
                        }
                    },
                    sellerLevel: {
                        select: {
                            name: true
                        }
                    },
                    summary: true,
                    sellerID: true
                },
            }
        };

        const cursor = req.body.cursor ? { 
            userID_sellerID: {
                userID: req.userData.userID,
                sellerID: req.body.cursor
            }
        } : {};

        const options = {
            orderBy: {
                seller: {
                    sellerID: 'asc'
                }
            }
        };

        const result = await getPaginatedData(where, select, "savedSeller", req.body.limit, cursor, "userID_sellerID", options);
        const savedSellers = result.next.map((x) => x.seller);

        return { 
            ...result,
            next: savedSellers
        };
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