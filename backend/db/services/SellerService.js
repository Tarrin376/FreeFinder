import { prisma } from "./UserService.js";
import { Prisma } from '@prisma/client';
import { paginationLimit } from "../index.js";
import { sortByParams } from "../utils/sortByParams.js";

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

export async function sellerPostsHandler(sellerUserID, cursor, sortBy) {
    try {
        const seller = await prisma.seller.findUnique({ 
            where: { 
                userID: sellerUserID
            }
        });

        if (!seller) {
            return { 
                posts: [],
                cursor: "HEAD", 
                last: true
            };
        }

        if (cursor === "HEAD") return firstQuerySellerPosts(seller.sellerID, sortBy);
        else return secondQuerySellerPosts(seller.sellerID, cursor, sortBy);
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

export async function firstQuerySellerPosts(sellerID, sortBy) {
    try {
        const posts = await prisma.post.findMany({
            take: paginationLimit,
            where: { sellerID: sellerID },
            orderBy: sortByParams[sortBy],
            select: { 
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
                    },
                },
                createdAt: true,
                numReviews: true,
                startingPrice: true,
                title: true,
                postID: true
            }
        });

        if (posts.length === 0) {
            return { 
                posts,
                cursor: "HEAD", 
                last: true
            };
        }
        
        const minNum = Math.min(paginationLimit - 1, posts.length - 1);
        return { 
            posts, 
            cursor: posts[minNum].postID, 
            last: minNum < paginationLimit - 1 
        };
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

export async function secondQuerySellerPosts(sellerID, cursor, sortBy) {
    try {
        const posts = await prisma.post.findMany({
            skip: 1,
            take: paginationLimit,
            orderBy: sortByParams[sortBy],
            cursor: { 
                postID: cursor 
            },
            where: { 
                sellerID: sellerID 
            },
            select: { 
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
                    },
                },
                createdAt: true,
                numReviews: true,
                startingPrice: true,
                title: true,
                postID: true
            }
        });

        if (posts.length === 0) {
            return { 
                posts, 
                cursor, 
                last: true
            };
        }

        const minNum = Math.min(paginationLimit - 1, posts.length - 1);
        return { 
            posts, 
            cursor: posts[minNum].postID, 
            last: minNum < paginationLimit - 1
        };
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