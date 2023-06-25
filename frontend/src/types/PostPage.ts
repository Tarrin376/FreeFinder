import { IPackage } from "../models/IPackage";
import { IPostImage } from "../models/IPostImage";

export type PostPage = {
    postID: string,
    sellerID: string,
    about: string,
    createdAt: Date,
    title: string,
    startingPrice: string,
    postedBy: {
        rating: number,
        description: string,
        numReviews: number,
        user: {
            username: string,
            country: string,
            memberDate: Date,
            status: string,
            profilePicURL: string,
        }
    },
    packages: IPackage[],
    images: IPostImage[]
}