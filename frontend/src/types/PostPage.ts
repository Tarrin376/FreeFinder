import { IPackage } from "../models/IPackage";
import { IPostImage } from "../models/IPostImage";
import { UserSummary } from "./UserSummary";

export type PostPage = {
    postID: string,
    sellerID: string,
    about: string,
    createdAt: Date,
    title: string,
    workType: {
        name: string,
        jobCategory: {
            name: string
        }
    },
    postedBy: {
        rating: number,
        description: string,
        summary: string,
        _count: {
            reviews: number
        },
        languages: string[],
        skills: string[],
        user: UserSummary,
        sellerLevel: {
            name: string
        }
    },
    packages: IPackage[],
    images: IPostImage[],
}