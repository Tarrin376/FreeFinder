import { UserStatus } from "../enums/UserStatus";
import { IMessageFile } from "./IMessageFile";
import { OrderRequestStatus } from "../enums/OrderRequestStatus";

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
        status: OrderRequestStatus,
        id: string,
        actionTaken: Date,
        package: {
            revisions: string,
            deliveryTime: number,
            amount: number,
            type: string,
        }
    }
}