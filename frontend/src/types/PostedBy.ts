import { ISellerLevel } from "../models/ISellerLevel"

export type PostedBy = {
    user: {
        profilePicURL: string,
        status: string,
        username: string,
    },
    rating: number,
    sellerID: string,
    sellerLevel: ISellerLevel
}