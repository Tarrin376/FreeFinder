import { UserStatus } from "../enums/UserStatus";
import { IMessageFile } from "./IMessageFile";
import { IOrderRequest } from "./IOrderRequest";
import { ICompleteOrderRequest } from "./ICompleteOrderRequest";

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
    orderRequest?: IOrderRequest,
    completeOrderRequest?: ICompleteOrderRequest
}