import { UserStatus } from "../enums/UserStatus";
import { IMessageFile } from "./IMessageFile";

export interface IMessage {
    from: {
        username: string,
        profilePicURL: string,
        status: UserStatus
    },
    files: IMessageFile[]
    messageText: string,
    createdAt: Date,
    messageID: string
}