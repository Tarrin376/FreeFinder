export interface IUser {
    username: string,
    country: string,
    profilePicURL: string,
    email: string,
    status: string,
    userID: string,
    memberDate: Date,
    seller: {
        description: string,
        rating: number,
        sellerID: string
    }
}