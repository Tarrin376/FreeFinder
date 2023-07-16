import { PaginationResponse } from "./PaginateResponse";

export type ReviewsResponse<T> = PaginationResponse<T> & {
    averages: {
        rating: number,
        serviceAsDescribed: number,
        sellerCommunication: number,
        serviceDelivery: number
    }
    stars: number[],
}