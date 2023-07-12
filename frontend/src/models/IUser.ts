import { ISeller } from "./ISeller"

export interface IUser {
    username: string,
    country: string,
    profilePicURL: string,
    email: string,
    status: string,
    userID: string,
    seller: ISeller | null,
    savedPosts: Set<string>,
    savedSellers: Set<string>
}