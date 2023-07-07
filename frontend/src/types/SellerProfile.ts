import { IReview } from "../models/IReview";
import { IPost } from "../models/IPost";
import { ISellerLevel } from "../models/ISellerLevel";

export type SellerProfile = {
    rating: number,
    reviews: IReview[],
    posts: IPost[],
    description: string,
    summary: string,
    numReviews: number,
    languages: string[],
    sellerLevel: ISellerLevel,
    user: {
        profilePicURL: string,
        status: string,
        username: string,
        country: string
    }
}