import { UserStatus } from "../enums/UserStatus";

export type GroupPreview = {
    groupName: string,
    groupID: string,
    creatorID: string,
    lastMessage: {
        from: {
            username: string
        },
        messageText: string,
        createdAt: Date
    },
    members: {
        user: {
            username: string,
            profilePicURL: string,
            status: UserStatus,
            userID: string
        }
    }[]
};