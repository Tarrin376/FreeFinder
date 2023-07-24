import { UserStatus } from "../enums/UserStatus"
import { ISellerLevel } from "../models/ISellerLevel"

export type PostedBy = {
    user: {
        profilePicURL: string,
        status: UserStatus,
        username: string,
    },
    rating: number,
    sellerID: string,
    sellerLevel: ISellerLevel
}