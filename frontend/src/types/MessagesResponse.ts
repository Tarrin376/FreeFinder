import { PaginationResponse } from "./PaginateResponse";
import { UserStatus } from "../enums/UserStatus";

export type MessagesResponse<T> = PaginationResponse<T> & {
    groupName: string
    groupID: string,
    members: {
        user: {
            username: string,
            profilePicURL: string,
            status: UserStatus
        }
    }[]
}