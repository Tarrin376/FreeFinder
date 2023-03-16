import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

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
}

export async function createSeller(userID) {
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