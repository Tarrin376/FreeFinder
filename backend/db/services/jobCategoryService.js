import { Prisma } from '@prisma/client';
import { prisma } from '../index.js';
import { DBError } from '../customErrors/DBError.js';

export async function createJobCategoryHandler(jobCategory) {
    try {
        await prisma.jobCategory.create({ data: { name: jobCategory } });
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            throw new DBError("This job category already exists.", 409);
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

export async function getJobCategoriesHandler() {
    try {
        const jobCategories = await prisma.jobCategory.findMany({
            select: {
                name: true,
                workTypes: {
                    select: {
                        name: true
                    }
                }
            }
        });

        return jobCategories;
    }
    catch (err) {
        throw new DBError("Something went wrong when trying to process this request.", 500);
    }
    finally {
        await prisma.$disconnect();
    }
}