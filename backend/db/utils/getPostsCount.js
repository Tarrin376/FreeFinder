import { prisma } from "../index.js";

export async function getPostsCount(filters) {
    return new Promise(async (resolve, reject) => {
        const count = await prisma.post.count({ 
            where: { 
                ...filters
            }
        });
        
        resolve(count);
    });
}