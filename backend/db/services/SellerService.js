import { prisma } from "./UserService.js";
import { Prisma } from '@prisma/client';

const takeAmount = 10;

export async function findSeller(userID) {
    try {
        const seller = await prisma.seller.findUnique({ where: { userID: userID } });
        if (!seller) {
            const newSeller = await createSeller(userID);
            return newSeller;
        } else {
            return seller;
        }
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientUnknownRequestError) {
            throw new Error("Something went wrong when trying to process your request. Please try again.");
        } else {
            throw err;
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

async function createSeller(userID) {
    try {
        const seller = await prisma.seller.create({
            data: {
                userID: userID,
                rating: 0,
                description: ""
            }
        });

        return seller;
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientUnknownRequestError) {
            throw new Error("Something went wrong when trying to process your request. Please try again.");
        } else {
            throw err;
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function sellerPostsHandler(sellerUserID, cursor) {
    try {
        const seller = await prisma.seller.findUnique({ 
            where: { 
                userID: sellerUserID
            }
        });

        if (!seller) {
            throw new Error("You currently have no posts");
        }

        if (cursor === "HEAD") return firstQuerySellerPosts(seller.sellerID);
        else return secondQuerySellerPosts(seller.sellerID, cursor);
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientUnknownRequestError) {
            throw new Error("Something went wrong when trying to process your request. Please try again.");
        } else {
            throw err;
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function firstQuerySellerPosts(sellerID) {
    try {
        const posts = await prisma.post.findMany({
            take: takeAmount,
            where: { sellerID: sellerID },
            orderBy: { createdAt: 'desc' },
            include: { 
                postedBy: {
                    select: {
                        user: {
                            select: {
                                profilePicURL: true,
                                status: true,
                                username: true,
                            }
                        },
                        rating: true,
                        description: true,
                        numReviews: true
                    }
                }
            }
        });

        if (posts.length === 0) {
            return { posts: [] };
        }
        
        const minNum = Math.min(takeAmount - 1, posts.length - 1);
        return { posts, cursor: posts[minNum].postID, last: minNum < takeAmount - 1 };
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientUnknownRequestError) {
            throw new Error("Something went wrong when trying to process your request. Please try again.");
        } else {
            throw err;
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function secondQuerySellerPosts(sellerID, cursor) {
    try {
        const posts = await prisma.post.findMany({
            skip: 1,
            take: takeAmount,
            cursor: { postID: cursor },
            where: { sellerID: sellerID },
            orderBy: { createdAt: 'desc' },
            include: { 
                postedBy: {
                    select: {
                        user: {
                            select: {
                                profilePicURL: true,
                                status: true,
                                username: true,
                            }
                        },
                        rating: true,
                        description: true,
                        numReviews: true
                    }
                }
            }
        });

        if (posts.length === 0) {
            return { posts: [] };
        }

        const minNum = Math.min(takeAmount - 1, posts.length - 1);
        return { posts, cursor: posts[minNum].postID, last: minNum < takeAmount - 1 };
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientUnknownRequestError) {
            throw new Error("Something went wrong when trying to process your request. Please try again.");
        } else {
            throw err;
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function updateSellerDetailsHandler(sellerDetails) {
    try {
        const updatedDetails = await prisma.seller.update({
            where: {
                userID: sellerDetails.userID
            },
            data: {
                description: sellerDetails.description
            },
            select: {
                sellerID: true,
                description: true,
                rating: true,
            }
        });

        return updatedDetails
    }
    catch (err) {
        throw err;
    }
    finally {
        await prisma.$disconnect();
    }
}