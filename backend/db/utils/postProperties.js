export const postProperties = {
    select: {
        postedBy: {
            select: {
                user: {
                    select: {
                        username: true,
                        country: true,
                        memberDate: true,
                        status: true,
                        profilePicURL: true,
                        userID: true
                    }
                },
                rating: true,
                description: true,
                summary: true,
                languages: true,
                skills: true,
                sellerLevel: {
                    select: {
                        name: true,
                    }
                }
            },
        },
        packages: {
            select: {
                deliveryTime: true,
                revisions: true,
                description: true,
                amount: true,
                type: true,
                features: true,
                numOrders: true,
                title: true
            }
        },
        images: {
            select: {
                url: true,
                cloudinaryID: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        },
        title: true,
        createdAt: true,
        about: true,
        sellerID: true,
        postID: true,
        workType: {
            select: {
                name: true,
                jobCategory: {
                    select: {
                        name: true
                    }
                }
            }
        }
    }
};