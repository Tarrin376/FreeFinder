import { Prisma } from '@prisma/client';
import { prisma } from './UserService.js';
import { findSeller } from './SellerService.js';

const takeAmount = 10;

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

        if (cursor === "HEAD") return firstQueryMyPosts(seller.sellerID);
        else return secondQueryMyPosts(seller.sellerID, cursor);
    }
    catch (err) {
        throw err;
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function firstQueryMyPosts(sellerID) {
    const posts = await prisma.post.findMany({
        take: takeAmount,
        where: { sellerID: sellerID },
        orderBy: { createdAt: 'desc' }
    });

    if (posts.length === 0) {
        return { posts: [] };
    }

    await prisma.$disconnect();
    const lastRes = posts[Math.min(takeAmount - 1, posts.length - 1)];
    return { posts, cursor: lastRes.postID };
}

export async function secondQueryMyPosts(sellerID, cursor) {
    const posts = await prisma.post.findMany({
        skip: 1,
        take: takeAmount,
        cursor: { postID: cursor },
        where: { sellerID: sellerID },
        orderBy: { createdAt: 'desc' }
    });

    if (posts.length === 0) {
        return { posts: [] };
    }

    await prisma.$disconnect();
    const lastRes = posts[Math.min(takeAmount - 1, posts.length - 1)];
    return { posts, cursor: lastRes.postID };
}

export async function savePostHandler(postID, userID) {
    try {
        await prisma.savedPost.create({
            data: {
                userID: userID,
                postID: postID
            }
        });
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2002') {
                throw new Error("Post already added");
            }
        }
        throw err;
    }
    finally {
        await prisma.$disconnect();
    }
}