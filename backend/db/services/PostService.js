import { Prisma } from '@prisma/client';
import { prisma } from './UserService.js';
import { findSeller } from './SellerService.js';

export async function createPostHandler(postData, userID) {
    try {
        const seller = await findSeller(userID);
        await prisma.post.create({
            data: {
                sellerID: seller.sellerID,
                about: postData.about,
                title: postData.title,
                startingPrice: +postData.startingPrice
            }
        });
    }
    catch (err) {
        const error = new Error("Something went wrong when trying to process your request. Please try again.");
        error.code = 400;
        throw error;
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function getPostHandler(postID) {
    try {
        const postData = await prisma.post.findUnique({
            where: {
                postID: postID
            },
            include: {
                postedBy: {
                    include: {
                        user: {
                            select: {
                                username: true,
                                country: true,
                                memberDate: true,
                                status: true,
                                profilePicURL: true,
                            }
                        },
                    },
                }
            }
        });

        const { ...post } = postData;
        const { userID, sellerID, ...postedBy } = postData.postedBy;
        return { ...post, postedBy };
    }
    catch (err) {
        const error = new Error("Something went wrong when trying to process your request. Please try again.");
        error.code = 400;
        throw error;
    }
    finally {
        prisma.$disconnect();
    }
}

export async function deletePostHandler(postID) {
    try {
        await prisma.post.delete({
            where: {
                postID: postID
            }
        });
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            const error = new Error("Post not found");
            error.code = 404;
            throw error;
        } else {
            const error = new Error("Something went wrong when trying to process your request. Please try again.");
            error.code = 400;
            throw error;
        }
    }
    finally {
        prisma.$disconnect();
    }
}