import { UserStatus } from "../enums/UserStatus";

export type UserSummary = {
    username: string,
    country: string,
    memberDate: Date,
    status: UserStatus,
    profilePicURL: string,
    userID: string
}