export interface IListing {
    about: string,
    createdAt: Date,
    postID: string,
    sellerID: string,
    startingPrice: number,
    title: string,
    postedBy: {
        description: string,
        rating: number,
        numReviews: number,
        user: {
            profilePicURL: string,
            status: string,
            username: string,
        }
    }
}