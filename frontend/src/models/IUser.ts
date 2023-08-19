import { UserStatus } from "../enums/UserStatus";
import { TNotificationSettings } from "src/types/TNotificationSettings";
import { ISellerLevel } from "./ISellerLevel";

export interface IUser {
    username: string,
    country: string,
    profilePicURL: string,
    email: string,
    status: UserStatus,
    userID: string,
    unreadMessages: number,
    unreadNotifications: number,
    notificationSettings: TNotificationSettings | null,
    seller: {
        description: string,
        sellerID: string,
        languages: string[],
        skills: string[],
        sellerXP: number,
        summary: string,
        sellerLevel: ISellerLevel
    } | null
}