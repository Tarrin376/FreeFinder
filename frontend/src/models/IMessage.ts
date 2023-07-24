import { UserStatus } from "../enums/UserStatus"

export interface IMessage {
    from: {
        username: string,
        profilePicURL: string,
        status: UserStatus
    },
    messageText: string,
    createdAt: Date,
    messageID: string
}