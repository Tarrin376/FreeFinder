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
        throw err;
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
        throw err;
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function sellerPostsHandler(userID, cursor) {
    try {
        const seller = await prisma.seller.findUnique({ 
            where: { 
                userID: userID
            }
        });

        if (!seller) {
            throw new Error("You currently have no posts");
        }

        if (cursor === "HEAD") return firstQuerySellerPosts(seller.sellerID);
        else return secondQuerySellerPosts(seller.sellerID, cursor);
    }
    catch (err) {
        throw err;
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function firstQuerySellerPosts(sellerID) {
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

    await prisma.$disconnect();
    const lastRes = posts[Math.min(takeAmount - 1, posts.length - 1)];
    return { posts, cursor: lastRes.postID };
}

export async function secondQuerySellerPosts(sellerID, cursor) {
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

    await prisma.$disconnect();
    const lastRes = posts[Math.min(takeAmount - 1, posts.length - 1)];
    return { posts, cursor: lastRes.postID };
}