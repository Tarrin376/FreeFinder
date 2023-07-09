export type PaginationResponse<T2> = { 
    next: T2[], 
    cursor: string, 
    last: boolean, 
    count: number 
}