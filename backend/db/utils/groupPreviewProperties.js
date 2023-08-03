export const groupPreviewProperties = {
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
            files: {
                select: {
                    url: true,
                    name: true,
                    fileType: true,
                    fileSize: true
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
    },
    post: {
        select: {
            postedBy: {
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
            },
            workType: {
                select: {
                    name: true
                }
            }
        }
    }
};