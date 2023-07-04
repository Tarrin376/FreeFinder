import { IPostImage } from "./IPostImage"

export interface IPost {
    createdAt: Date,
    postID: string,
    startingPrice: number,
    title: string,
    numReviews: number,
    postedBy: {
        user: {
            profilePicURL: string,
            status: string,
            username: string,
        },
        rating: number,
        sellerLevel: {
            name: string
        }
    },
    images: IPostImage[]
}