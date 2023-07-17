import { PaginationResponse } from "./PaginateResponse";
import { RatingAverages } from "./RatingAverages";
import { StarCounts } from "./StarCounts";

export type ReviewsResponse<T> = PaginationResponse<T> & {
    averages?: RatingAverages
    starCounts?: StarCounts,
}