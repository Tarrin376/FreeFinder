import { sellerLevelProperties } from "./sellerLevelProperties.js"

export const userProperties = {
    seller: {
        select: {
            description: true,
            sellerID: true,
            languages: true,
            skills: true,
            sellerXP: true,
            summary: true,
            ...sellerLevelProperties
        }
    },
    username: true,
    country: true,
    profilePicURL: true,
    email: true,
    status: true,
    userID: true,
    unreadMessages: true,
    notificationSettings: true,
    unreadNotifications: true
}