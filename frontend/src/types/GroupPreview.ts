import { UserStatus } from "../enums/UserStatus";
import { IMessage } from "../models/IMessage";
import { FoundUsers } from "./FoundUsers";

export type GroupPreview = {
    groupName: string,
    groupID: string,
    creatorID: string,
    lastMessage: IMessage,
    workType: string,
    seller: FoundUsers[number],
    members: Array<{
        user: {
            username: string,
            profilePicURL: string,
            status: UserStatus,
            userID: string
        }
    }>
};