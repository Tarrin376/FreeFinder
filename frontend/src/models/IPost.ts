export interface IPost {
    createdAt: Date,
    postID: string,
    startingPrice: number,
    title: string,
    numReviews: number,
    postedBy: {
        rating: number,
        user: {
            profilePicURL: string,
            status: string,
            username: string,
        }
    }
}