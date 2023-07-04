import { prisma } from '../index.js';
import { Prisma } from '@prisma/client';
import { DBError } from "../customErrors/DBError.js";
import { checkUser } from "../utils/checkUser.js";

export async function findSeller(userID) {
    try {
        const seller = await prisma.seller.findUnique({ 
            where: { 
                userID: userID 
            },
            select: {
                description: true,
                rating: true,
                sellerID: true,
                languages: true,
                sellerXP: true,
                sellerLevel: {
                    select: {
                        xpRequired: true,
                        name: true,
                        nextLevel: {
                            select: {
                                xpRequired: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });

        if (!seller) {
            const newSeller = await createSeller(userID);
            return newSeller;
        } else {
            return seller;
        }
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong when trying to find this seller. Please try again.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

async function createSeller(id) {
    try {
        const newSeller = await prisma.sellerLevel.findFirst({
            where: {
                xpRequired: 0
            }
        });

        if (!newSeller) {
            throw new DBError("'New Seller' seller level does not exist.", 400);
        }

        const seller = await prisma.seller.create({
            data: {
                userID: id,
                rating: 0,
                description: "",
                sellerLevelID: newSeller.id
            },
            select: {
                description: true,
                rating: true,
                sellerID: true,
                languages: true,
                sellerXP: true,
                sellerLevel: {
                    select: {
                        xpRequired: true,
                        name: true,
                        nextLevel: {
                            select: {
                                xpRequired: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });

        return seller;
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
            throw new DBError("You are already a seller.", 409);
        } else {
            throw new DBError("Something went wrong when trying to make you a seller. Please try again.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function updateSellerDetailsHandler(req) {
    try {
        await checkUser(req.userData.userID, req.params.username);
        const updatedDetails = await prisma.seller.update({
            where: {
                userID: req.userData.userID
            },
            data: {
                description: req.body.description,
                languages: req.body.languages
            },
            select: {
                sellerID: true,
                description: true,
                rating: true,
                languages: true,
                sellerXP: true,
                sellerLevel: {
                    select: {
                        xpRequired: true,
                        name: true,
                        nextLevel: {
                            select: {
                                xpRequired: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });

        return updatedDetails;
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            throw new DBError("Seller not found.", 404);
        } else {
            throw new DBError("Something went wrong when trying to process your request. Please try again.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function getSellerDetailsHandler(username) {

}