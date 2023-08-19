import { UserStatus } from "../enums/UserStatus";

export type PostedBy = {
    user: {
        profilePicURL: string,
        status: UserStatus,
        username: string,
    },
    rating: number,
    sellerID: string,
    sellerLevel: {
        name: string
    }
}