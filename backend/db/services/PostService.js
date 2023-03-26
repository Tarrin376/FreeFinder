import { Prisma } from '@prisma/client';
import { prisma } from './UserService.js';
import { findSeller } from './SellerService.js';

export async function createPostHandler(postData, userID) {
    try {
        const seller = await findSeller(userID);
        const res = await prisma.post.create({
            data: {
                sellerID: seller.sellerID,
                about: postData.about,
                title: postData.title,
                startingPrice: postData.startingPrice
            }
        });

        createPostPackage(postData.packages[0], res.postID, "BASIC");
        if (postData.packages.length >= 2) createPostPackage(postData.packages[1], res.postID, "STANDARD");
        if (postData.packages.length === 3) createPostPackage(postData.packages[2], res.postID, "SUPERIOR");
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

export async function createPostPackage(packageData, postID, type) {
    try {
        await prisma.package.create({
            data: {
                postID: postID,
                deliveryTime: packageData.deliveryTime,
                revisions: packageData.revisions,
                description: packageData.description,
                type: type,
                features: packageData.features
            }
        });
    }
    catch (err) {
        const error = new Error("Something went wrong when trying to process your request. Please try again.");
        error.code = 400;
        throw error;
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
                },
                packages: {
                    select: {
                        deliveryTime: true,
                        revisions: true,
                        description: true,
                        type: true,
                        features: true
                    }
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