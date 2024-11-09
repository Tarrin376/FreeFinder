import { prisma } from '../index.js';
import { DBError } from "../customErrors/DBError.js";

export async function countReviewRating(rating, postID, sellerID) {
    try {
        const count = await prisma.review.count({
            where: {
                postID: postID,
                sellerID: sellerID,
                isOldReview: false,
                rating: {
                    gte: rating,
                    lt: rating + 1
                }
            }
        });
    
        return count;
    }
    catch (err) {
        throw new DBError("Something went wrong. Please try again later.", 500);
    }
    finally {
        await prisma.$disconnect();
    }
}