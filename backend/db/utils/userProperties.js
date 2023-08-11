export const userProperties = {
    seller: {
        select: {
            description: true,
            sellerID: true,
            languages: true,
            skills: true,
            sellerXP: true,
            summary: true,
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
    },
    username: true,
    country: true,
    profilePicURL: true,
    email: true,
    status: true,
    userID: true,
    unreadMessages: true
}