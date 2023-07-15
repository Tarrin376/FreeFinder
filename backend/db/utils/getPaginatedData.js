import { Prisma } from '@prisma/client';
import { prisma } from '../index.js';
import { DBError } from '../customErrors/DBError.js';

export async function getPaginatedData(where, select, tableName, limit, cursor, cursorColumn, options = {}) {
    try {
        const take = parseInt(limit);
        const query = {
            take: take ? take : undefined,
            skip: cursor[cursorColumn] ? 1 : undefined,
            cursor: cursor[cursorColumn] ? cursor : undefined,
            where: {
                ...where,
            },
            select: {
                ...select
            },
            ...options
        };

        const result = await prisma[tableName].findMany(query);
        const count = cursor[cursorColumn] ? 0 : await prisma[tableName].count({ where: { ...where } });

        if (result.length === 0) {
            return { 
                next: result, 
                cursor: undefined, 
                last: true,
                count: count
            };
        }

        const minNum = Math.min(isNaN(take) ? result.length - 1 : take - 1, result.length - 1);
        return { 
            next: result, 
            cursor: result[minNum][cursorColumn],
            last: isNaN(take) || minNum < take - 1,
            count: count
        };
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong when trying to get reviews of this post. Please try again.", 500);
        }
    }
}