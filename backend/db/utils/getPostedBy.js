import { Prisma } from '@prisma/client';
import { prisma } from '../index.js';
import { DBError } from '../customErrors/DBError.js';

export async function getPostedBy(id) {
    try {
        const post = await prisma.post.findUnique({ 
            where: { 
                postID: id
            },
            select: {
                postedBy: {
                    select: {
                        userID: true
                    }
                }
            }
        });
        
        if (!post) {
            throw new DBError("Service does not exist or has been deleted.", 404);
        }
    
        return post.postedBy.userID;
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