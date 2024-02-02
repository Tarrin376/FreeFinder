import { prisma } from "../index.js";
import { Prisma } from "@prisma/client";
import { DBError } from "../customErrors/DBError.js";

export async function giveSellerXP(sellerID, amount) {
    try {
        const seller = await prisma.seller.findUnique({
            where: { sellerID: sellerID },
            select: { 
                sellerXP: true,
                sellerLevel: {
                    select: {
                        nextLevel: {
                            select: {
                                xpRequired: true,
                                id: true
                            }
                        }
                    }
                }
            }
        });

        if (seller == null) {
            throw new DBError("Seller does not exist.", 404);
        }
    
        const addSellerXP = await prisma.seller.update({
            where: { sellerID: sellerID },
            select: { sellerXP: true },
            data: {
                sellerXP: { increment: amount }
            }
        });
    
        if (addSellerXP.sellerXP >= seller.sellerLevel.nextLevel.xpRequired) {
            const remainingXP = addSellerXP.sellerXP - seller.sellerLevel.nextLevel.xpRequired;
            await prisma.seller.update({
                where: { sellerID: sellerID },
                data: {
                    sellerXP: remainingXP,
                    sellerLevelID: seller.sellerLevel.nextLevel.id
                }
            });
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
}