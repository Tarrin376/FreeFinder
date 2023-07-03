import { MAX_DELIVERY_DAYS } from "../views/CreatePost/Package"

export const deliveryTimes: {
    [key: string]: number
} = {
    "1 day": 1,
    "Up to 3 days": 3,
    "Up to 7 days": 7,
    "Anytime": MAX_DELIVERY_DAYS
}