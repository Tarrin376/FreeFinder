import { prisma } from "../index.js";
import { DBError } from "../customErrors/DBError.js";
import { Prisma } from "@prisma/client";

export async function getSellerLevelsHandler() {
    try {
        const sellerLevels = await prisma.sellerLevel.findMany({
            orderBy: { xpRequired: 'asc' },
            include: {
                nextLevel: true,
                prevLevel: true
            }
        });
        
        return sellerLevels;
    }
    catch (err) {
        throw new DBError("Something went wrong. Please try again later.", 500);
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function createSellerLevelHandler(body) {
    try {
        const newLevel = await prisma.sellerLevel.create({
            data: {
                xpRequired: body.xpRequired,
                name: body.name,
            }
        });

        return newLevel;
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function updateSellerLevelHandler(req) {
    try {
        await prisma.sellerLevel.update({
            where: { id: req.params.id },
            data: { ...req.body }
        });
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function deleteSellerLevelHandler(req) {
    try {
        await prisma.sellerLevel.delete({ 
            where: { id: req.params.id } 
        });
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            throw new DBError("This seller level does not exist.", 404);
        } else {
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}