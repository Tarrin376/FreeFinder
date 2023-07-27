
export const groupPreviewProperties = {
    select: {
        groupName: true,
        groupID: true,
        creatorID: true,
        messages: {
            take: 1,
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                from: {
                    select: {
                        username: true,
                        profilePicURL: true,
                        status: true
                    }
                },
                messageText: true,
                createdAt: true,
                messageID: true
            }
        },
        members: {
            select: {
                user: {
                    select: {
                        username: true,
                        profilePicURL: true,
                        status: true,
                        userID: true
                    }
                }
            }
        }
    }
};