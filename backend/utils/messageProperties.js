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
    completeOrderRequest: {
        select: {
            status: true,
            expires: true,
            id: true,
            order: {
                select: {
                    subTotal: true,
                    total: true,
                    sellerID: true,
                    orderID: true,
                    clientID: true
                }
            }
        }
    },
    messageText: true,
    createdAt: true,
    messageID: true,
    groupID: true
}