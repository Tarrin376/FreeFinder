import { MAX_SERVICE_DELIVERY_DAYS } from "@freefinder/shared/dist/constants";

export const deliveryTimes: {
    [key: string]: number
} = {
    "1 day": 1,
    "Up to 3 days": 3,
    "Up to 7 days": 7,
    "Anytime": MAX_SERVICE_DELIVERY_DAYS
}