import { prisma } from '../index.js';
import { Prisma } from '@prisma/client';
import { DBError } from "../customErrors/DBError.js";
import { checkUser } from "../utils/checkUser.js";

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
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
            throw new DBError("Seller already saved.", 409);
        } else {
            throw new DBError("Something went wrong when trying to process this request.", 500);
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
            throw new DBError("Something went wrong when trying to process this request.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function getSavedSellersHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        return await querySavedSellers(req);
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong when trying to process this request.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

async function querySavedSellers(req) {
    const limit = parseInt(req.body.limit);
    const query = {
        take: limit ? limit : undefined,
        skip: req.body.cursor ? 1 : undefined,
        cursor: req.body.cursor ? { 
            userID_sellerID: {
                userID: req.userData.userID,
                sellerID: req.body.cursor
            }
        } : undefined,
        where: {
            userID: req.userData.userID
        },
        select: {
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
        },
        orderBy: {
            seller: {
                sellerID: 'asc'
            }
        }
    };

    const [saved, count] = await prisma.$transaction([
        prisma.savedSeller.findMany(query),
        prisma.savedSeller.count({ where: { userID: req.userData.userID } })
    ]);

    if (saved.length === 0) {
        return { 
            next: [], 
            cursor: undefined, 
            last: true,
            count: count
        };
    }

    const minNum = Math.min(isNaN(limit) ? saved.length - 1 : limit - 1, saved.length - 1);
    const savedSellers = saved.map((savedSeller) => savedSeller.seller);

    return { 
        next: savedSellers, 
        cursor: savedSellers[minNum].sellerID,
        last: isNaN(limit) || minNum < limit - 1,
        count: count
    };
}