import { prisma } from '../index.js';
import { Prisma } from '@prisma/client';
import { DBError } from "../customErrors/DBError.js";
import { checkUser } from '../utils/checkUser.js';
import { MAX_REVIEW_CHARS } from '@freefinder/shared/dist/constants.js';
import { giveSellerXP } from '../utils/giveSellerXP.js';

export async function createReviewHandler(req) {
    try {
        await checkUser(req.userData.userID, req.params.username);
        const post = await prisma.post.findUnique({
            where: { postID: req.body.postID },
            select: {
                hidden: true,
                postID: true,
                postedBy: {
                    select: {
                        userID: true,
                        sellerID: true,
                        user: {
                            select: {
                                notificationSettings: true,
                                socketID: true
                            }
                        }
                    }
                }
            }
        });

        if (post == null) {
            throw new DBError("Service does not exist or has been deleted.", 404);
        } else if (post.postedBy.userID === req.userData.userID) {
            throw new DBError("You cannot write a review of your own service.", 403);
        } else if (!req.body.review || req.body.review.length > MAX_REVIEW_CHARS) {
            throw new DBError(`Review is empty or is more than ${MAX_REVIEW_CHARS} characters long.`, 400);
        } else if (post.hidden) {
            throw new DBError("You cannot write a review of a hidden service.", 403);
        }

        const serviceAsDescribed = parseInt(req.body.serviceAsDescribed);
        const sellerCommunication = parseInt(req.body.sellerCommunication);
        const serviceDelivery = parseInt(req.body.serviceDelivery);

        if (Math.min(serviceAsDescribed, sellerCommunication, serviceDelivery) < 1 
        || Math.max(serviceAsDescribed, sellerCommunication, serviceDelivery) > 5) {
            throw new DBError("Ratings must be between 1 and 5.", 400);
        }

        const oldReview = await prisma.review.findFirst({
            where: {
                reviewerID: req.userData.userID,
                postID: req.body.postID
            }
        });

        return await prisma.$transaction(async (tx) => {
            const rating = parseFloat(((serviceAsDescribed + sellerCommunication + serviceDelivery) / 3).toFixed(1));
            await tx.review.updateMany({
                where: {
                    reviewerID: req.userData.userID,
                    postID: req.body.postID,
                    isOldReview: false
                },
                data: {
                    isOldReview: true
                }
            });

            await tx.review.create({
                data: {
                    reviewerID: req.userData.userID,
                    sellerID: req.body.sellerID,
                    reviewBody: req.body.review,
                    rating: rating,
                    serviceAsDescribed: serviceAsDescribed,
                    sellerCommunication: sellerCommunication,
                    serviceDelivery: serviceDelivery,
                    postID: req.body.postID
                }
            });

            if (oldReview == null && rating >= 3.5) {
                const gainedXP = rating >= 4.7 ? 100 : rating >= 4 ? 50 : 25;
                giveSellerXP(post.postedBy.sellerID, gainedXP, tx);

                if (post.postedBy.user.notificationSettings.newReviews !== false) {
                    const notification = await tx.notification.create({
                        data: {
                            userID: post.postedBy.userID,
                            title: `You received a new review!`,
                            text: `Your service: ${post.postID} received a rating of ${rating}/5 from ${req.params.username}. Have a look what they said!`,
                            xp: gainedXP,
                            navigateTo: `/posts/${post.postID}`
                        }
                    });
    
                    return {
                        notification: notification,
                        socketID: post.postedBy.user.socketID
                    }
                }
            }
        });
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
}