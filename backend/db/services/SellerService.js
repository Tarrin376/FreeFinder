import { prisma } from "./UserService.js";

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