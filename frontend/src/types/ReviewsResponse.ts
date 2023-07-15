import { PaginationResponse } from "./PaginateResponse";

export type ReviewsResponse<T> = PaginationResponse<T> & {
    avgRating: number,
    stars: number[],
}