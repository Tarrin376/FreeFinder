import { Prisma } from '@prisma/client';
import { prisma } from '../index.js';
import { DBError } from '../customErrors/DBError.js';
import { checkUser } from '../utils/checkUser.js';

async function checkCanReview(userID, postID, reviewID) {
    try {
        const post = await prisma.post.findUnique({ 
            where: { postID: postID },
            select: {
                postedBy: {
                    select: {
                        userID: true
                    }
                }
            }
        });
    
        if (post.postedBy.userID === userID) {
            return false;
        }
    
        const review = await prisma.review.findUnique({ 
            where: { reviewID: reviewID },
            select: { reviewerID: true }
        });
    
        return review.reviewerID !== userID;
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
}

export async function markAsHelpfulHandler(req) {
    await checkUser(req.userData.userID, req.params.username);
    const canReview = await checkCanReview(req.userData.userID, req.params.postID, req.params.reviewID);

    if (!canReview) {
        return;
    }

    try {
        await prisma.helpfulReview.create({
            data: {
                userID: req.userData.userID,
                reviewID: req.params.reviewID
            }
        });
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
            return;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function markAsUnhelpfulHandler(req) {
    await checkUser(req.userData.userID, req.params.username);
    const canReview = await checkCanReview(req.userData.userID, req.params.postID, req.params.reviewID);

    if (!canReview) {
        return;
    }

    try {
        await prisma.helpfulReview.delete({
            where: {
                userID_reviewID: {
                    userID: req.userData.userID,
                    reviewID: req.params.reviewID
                }
            }
        });
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            return;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}