import { UserStatus } from "../enums/UserStatus";
import { IMessageFile } from "./IMessageFile";
import { IPackage } from "./IPackage";

export interface IMessage {
    from: {
        username: string,
        profilePicURL: string,
        status: UserStatus
    },
    files: IMessageFile[]
    messageText: string,
    createdAt: Date,
    messageID: string,
    groupID: string,
    orderRequest?: {
        package: IPackage
    }
}