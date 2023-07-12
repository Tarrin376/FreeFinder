import { sellerProperties } from "./sellerProperties.js"

export const userProperties = {
    seller: {
        ...sellerProperties,
    },
    savedPosts: {
        select: {
            postID: true
        }
    },
    savedSellers: {
        select: {
            sellerID: true
        }
    },
    username: true,
    country: true,
    profilePicURL: true,
    email: true,
    status: true,
    userID: true
}