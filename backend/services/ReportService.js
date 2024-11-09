import { Prisma } from '@prisma/client';
import { DBError } from '../customErrors/DBError.js';
import { checkUser } from '../utils/checkUser.js';
import { prisma } from '../index.js';

export async function reportSellerHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        await prisma.report.create({
            data: {
                userID: req.userData.userID,
                sellerID: req.params.sellerID,
                description: req.body.description
            }
        });
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            throw new DBError("User or seller not found.", 404);
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
}