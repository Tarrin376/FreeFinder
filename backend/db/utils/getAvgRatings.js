import { prisma } from '../index.js';
import { DBError } from "../customErrors/DBError.js";

export async function getAvgRatings(postID) {
    try {
        const averages = await prisma.review.aggregate({
            _avg: {
                rating: true,
                serviceAsDescribed: true,
                sellerCommunication: true,
                serviceDelivery: true
            },
            where: {
                postID: postID
            }
        });

        return averages;
    }
    catch (err) {
        throw new DBError("Something went wrong when trying to get the average rating of this post. Please try again.", 500);
    }
}