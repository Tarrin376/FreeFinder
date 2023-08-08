import { SearchOption } from "./SearchOptions"

export type PostArgs = {
    search: string | undefined,
    sort: string,
    min: number,
    max: number,
    country: string | undefined,
    languages: string[],
    deliveryTime: number,
    sellerLevels: string[],
    extraFilters: string[],
    selectedWork: string[],
    searchOption: SearchOption
}