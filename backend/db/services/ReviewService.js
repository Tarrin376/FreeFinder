import { prisma } from '../index.js';
import { Prisma } from '@prisma/client';
import { DBError } from "../customErrors/DBError.js";
import { getPaginatedData } from '../utils/getPaginatedData.js';
import { getAvgRatings } from '../utils/getAvgRatings.js';
import { countReviewRating } from '../utils/countReviewRating.js';
import { checkUser } from '../utils/checkUser.js';

export async function getPostReviewsHandler(req) {
    try {
        const filters = {
            postID: req.params.postID
        };
    
        const select = {
            reviewID: true,
            reviewer: {
                select: {
                    username: true,
                    country: true,
                    memberDate: true,
                    status: true,
                    profilePicURL: true,
                }
            },
            reviewBody: true,
            createdAt: true,
            rating: true,
        };
    
        const result = await getPaginatedData(
            filters, 
            select, 
            "review",
            req.body.limit, 
            { reviewID: req.body.cursor }, 
            "reviewID"
        );
        
        let averages = {};
        if (!req.body.cursor) {
            averages = (await getAvgRatings(req.params.postID))._avg;
        }
    
        const promises = new Array(5).fill(0).map((_, index) => countReviewRating(index + 1, req.params.postID).then((x) => x));
        const stars = await Promise.all(promises).then((stars) => stars);
    
        return { 
            ...result, 
            averages: averages,
            stars: stars
        } 
    }
    catch (err) {
        console.log(err);
        if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong when trying to get more posts. Please try again.", 500);
        }
    }
}

export async function createReviewHandler(req) {
    try {
        await checkUser(req.userData.userID, req.params.username);
        const serviceAsDescribed = parseInt(req.body.serviceAsDescribed);
        const sellerCommunication = parseInt(req.body.sellerCommunication);
        const serviceDelivery = parseInt(req.body.serviceDelivery);

        if (serviceAsDescribed > 5 || serviceAsDescribed < 1 || sellerCommunication > 5 
            || sellerCommunication < 1 || serviceDelivery > 5 || serviceDelivery < 1) {
            throw new DBError("Ratings must be between 1 and 5.", 400);
        }

        await prisma.review.create({
            data: {
                reviewerID: req.userData.userID,
                reviewBody: req.body.review,
                rating: (serviceAsDescribed + sellerCommunication + serviceDelivery) / 3,
                serviceAsDescribed: serviceAsDescribed,
                sellerCommunication: sellerCommunication,
                serviceDelivery: serviceDelivery,
                postID: req.params.postID
            }
        });
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong when trying to create this review. Please try again.", 500);
        }
    }
}