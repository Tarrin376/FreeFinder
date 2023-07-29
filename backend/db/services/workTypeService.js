import { Prisma } from '@prisma/client';
import { prisma } from '../index.js';
import { DBError } from '../customErrors/DBError.js';

export async function createWorkTypesHandler(workTypes, jobCategoryID) {
    try {
        await prisma.$transaction(async (tx) => {
            for (const workType of workTypes) {
                await tx.workType.create({
                    data: {
                        name: workType,
                        jobCategoryID: jobCategoryID
                    }
                });
            }
        });
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            throw new DBError("Work type already exists.", 409);
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