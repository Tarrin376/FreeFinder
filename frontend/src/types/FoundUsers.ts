import { UserStatus } from "../enums/UserStatus"

export type FoundUsers = {
    profilePicURL: string,
    username: string,
    status: UserStatus,
    userID: string
}[]