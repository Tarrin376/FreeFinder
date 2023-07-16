import { prisma } from '../index.js';
import { DBError } from "../customErrors/DBError.js";

export async function countReviewRating(rating, postID) {
    try {
        const count = await prisma.review.count({
            where: {
                postID: postID,
                rating: {
                    gte: rating,
                    lt: rating + 1
                }
            }
        });
    
        return count;
    }
    catch (err) {
        throw new DBError("Something went wrong. Please try again.", 500);
    }
}