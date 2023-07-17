import { UserSummary } from "../types/UserSummary"

export interface IReview {
    reviewer: UserSummary,
    reviewBody: string,
    createdAt: Date,
    rating: number,
    reviewID: string,
    _count: {
        foundHelpful: number
    }
}