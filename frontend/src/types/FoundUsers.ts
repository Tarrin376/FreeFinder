import { UserStatus } from "../enums/UserStatus"

export type FoundUsers = Array<{
    profilePicURL: string,
    username: string,
    status: UserStatus,
    userID: string
}>;