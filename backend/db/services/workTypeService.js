import { Prisma } from '@prisma/client';
import { prisma } from '../index.js';
import { DBError } from '../customErrors/DBError.js';

export async function createWorkTypesHandler(workTypes, jobCategoryID) {
    let failed = [];

    for (let workType of workTypes) {
        try {
            createWorkType(workType, jobCategoryID);
        }
        catch (err) {
            failed.push({
                name: workType,
                error: err.message
            });
        }
    }

    return failed;
}

async function createWorkType(workType, jobCategoryID) {
    try {
        await prisma.workType.create({
            data: {
                name: workType,
                jobCategoryID: jobCategoryID
            }
        });
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            throw new DBError("Work type already exists.", 409);
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong when trying to create a new work type. Please try again.", 500);
        }
    }
}