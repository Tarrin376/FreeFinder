import { UserStatus } from "../enums/UserStatus";
import { IMessage } from "../models/IMessage";

export type GroupPreview = {
    groupName: string,
    groupID: string,
    creatorID: string,
    lastMessage: IMessage,
    members: {
        user: {
            username: string,
            profilePicURL: string,
            status: UserStatus,
            userID: string
        }
    }[]
};