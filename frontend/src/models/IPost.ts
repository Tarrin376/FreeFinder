import { IPostImage } from "./IPostImage";
import { PostedBy } from "../types/PostedBy";

export interface IPost {
    createdAt: Date,
    postID: string,
    startingPrice: number,
    title: string,
    rating: number | null,
    hidden: boolean,
    _count: {
        reviews: number
    },
    postedBy: PostedBy,
    images: IPostImage[],
}