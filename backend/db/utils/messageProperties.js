export const messageProperties = {
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
            fileSize: true,
        }
    },
    orderRequest: {
        select: {
            status: true,
            id: true,
            actionTaken: true,
            expires: true,
            subTotal: true,
            total: true,
            package: {
                select: {
                    revisions: true,
                    deliveryTime: true,
                    type: true
                }
            }
        }
    },
    messageText: true,
    createdAt: true,
    messageID: true,
    groupID: true
}