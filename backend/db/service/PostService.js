import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();
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
}

async function findSeller(userID) {
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

        if (cursor === "HEAD") return firstQueryPostResults(seller.sellerID);
        else return secondQueryPostResults(seller.sellerID, cursor);
    }
    catch (err) {
        throw err;
    }
}

export async function firstQueryPostResults(sellerID) {
    const posts = await prisma.post.findMany({
        take: takeAmount,
        where: { sellerID: sellerID },
        orderBy: { createdAt: 'desc' }
    });

    if (posts.length === 0) {
        return { posts: [] };
    }

    const lastRes = posts[Math.min(takeAmount - 1, posts.length - 1)];
    return { posts, cursor: lastRes.postID };
}

export async function secondQueryPostResults(sellerID, cursor) {
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

    const lastRes = posts[Math.min(takeAmount - 1, posts.length - 1)];
    return { posts, cursor: lastRes.postID };
}