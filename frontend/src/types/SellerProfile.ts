import { IPost } from "../models/IPost";
import { ISellerLevel } from "../models/ISellerLevel";

export type SellerProfile = {
    rating: number,
    sellerID: string,
    posts: IPost[],
    description: string,
    summary: string,
    languages: string[],
    skills: string[],
    sellerLevel: ISellerLevel,
    user: {
        profilePicURL: string,
        status: string,
        username: string,
        country: string,
        memberDate: Date
    }
}