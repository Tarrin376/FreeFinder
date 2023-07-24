import { ISeller } from "./ISeller";
import { UserStatus } from "../enums/UserStatus";

export interface IUser {
    username: string,
    country: string,
    profilePicURL: string,
    email: string,
    status: UserStatus,
    userID: string,
    seller: ISeller | null,
    savedPosts: Set<string>,
    savedSellers: Set<string>
}