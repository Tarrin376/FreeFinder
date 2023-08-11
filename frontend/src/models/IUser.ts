import { UserStatus } from "../enums/UserStatus";

export interface IUser {
    username: string,
    country: string,
    profilePicURL: string,
    email: string,
    status: UserStatus,
    userID: string,
    unreadMessages: number,
    seller: {
        description: string,
        sellerID: string,
        languages: string[],
        skills: string[],
        sellerXP: number,
        summary: string,
        sellerLevel: {
            name: string,
            nextLevel: {
                xpRequired: number,
                name: string,
            }
        }
    } | null
}