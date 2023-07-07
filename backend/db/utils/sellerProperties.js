export const sellerProperties = {
    select: {
        description: true,
        rating: true,
        sellerID: true,
        languages: true,
        sellerXP: true,
        summary: true,
        sellerLevel: {
            select: {
                xpRequired: true,
                name: true,
                postLimit: true,
                nextLevel: {
                    select: {
                        xpRequired: true,
                        name: true,
                    }
                }
            }
        }
    }
};