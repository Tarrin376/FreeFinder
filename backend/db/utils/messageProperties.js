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
            package: {
                select: {
                    revisions: true,
                    features: true,
                    deliveryTime: true,
                    description: true,
                    amount: true,
                    numOrders: true,
                    type: true,
                    title: true
                }
            }
        }
    },
    messageText: true,
    createdAt: true,
    messageID: true,
    groupID: true
}