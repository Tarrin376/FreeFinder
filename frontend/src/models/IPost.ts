export interface IPost {
    about: string,
    createdAt: Date,
    postID: string,
    sellerID: string,
    startingPrice: string,
    thumbnailPicURL: string | null,
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