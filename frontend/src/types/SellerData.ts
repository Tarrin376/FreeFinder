import { UserStatus } from "../enums/UserStatus"

export type SellerData = {
    user: {
        username: string,
        profilePicURL: string,
        country: string,
        status: UserStatus,
    },
    sellerLevel: {
        name: string
    },
    summary: string,
    sellerID: string
}