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
        throw err;
    }
    finally {
        await prisma.$disconnect();
    }
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