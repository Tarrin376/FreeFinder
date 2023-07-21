import { prisma } from '../index.js';
import { Prisma } from '@prisma/client';
import { DBError } from "../customErrors/DBError.js";
import { checkUser } from '../utils/checkUser.js';

export async function createReviewHandler(req) {
    try {
        await checkUser(req.userData.userID, req.params.username);
        const post = await prisma.post.findUnique({
            where: {
                postID: req.body.postID
            },
            select: {
                postedBy: {
                    select: {
                        userID: true
                    }
                }
            }
        });
        
        if (post.postedBy.userID === req.userData.userID) {
            throw new DBError("You cannot write a review for your own service.", 403);
        }

        const serviceAsDescribed = parseInt(req.body.serviceAsDescribed);
        const sellerCommunication = parseInt(req.body.sellerCommunication);
        const serviceDelivery = parseInt(req.body.serviceDelivery);

        if (serviceAsDescribed > 5 || serviceAsDescribed < 1 || sellerCommunication > 5 
            || sellerCommunication < 1 || serviceDelivery > 5 || serviceDelivery < 1) {
            throw new DBError("Ratings must be between 1 and 5.", 400);
        }

        await prisma.$transaction([
            prisma.review.updateMany({
                where: {
                    reviewerID: req.userData.userID,
                    postID: req.body.postID,
                    isOldReview: false
                },
                data: {
                    isOldReview: true
                }
            }),
            prisma.review.create({
                data: {
                    reviewerID: req.userData.userID,
                    sellerID: req.body.sellerID,
                    reviewBody: req.body.review,
                    rating: (serviceAsDescribed + sellerCommunication + serviceDelivery) / 3,
                    serviceAsDescribed: serviceAsDescribed,
                    sellerCommunication: sellerCommunication,
                    serviceDelivery: serviceDelivery,
                    postID: req.body.postID
                }
            })
        ]);
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