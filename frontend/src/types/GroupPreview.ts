export type GroupPreview = {
    groupName: string,
    groupID: string,
    lastMessage: {
        from: {
            username: string
        },
        messageText: string,
        createdAt: Date
    }
};