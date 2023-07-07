import { IPostImage } from "./IPostImage";
import { PostedBy } from "../types/PostedBy";

export interface IPost {
    createdAt: Date,
    postID: string,
    startingPrice: number,
    title: string,
    numReviews: number,
    postedBy: PostedBy,
    images: IPostImage[]
}