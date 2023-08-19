export const sellerLevelProperties = {
    sellerLevel: {
        select: {
            name: true,
            nextLevel: {
                select: {
                    xpRequired: true,
                    name: true,
                }
            }
        }
    }
}