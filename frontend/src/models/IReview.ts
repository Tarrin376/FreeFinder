export interface IReview {
    reviewer: {
        username: string,
        country: string
    },
    reviewBody: string,
    createdAt: Date,
    rating: number,
    postID: string
}