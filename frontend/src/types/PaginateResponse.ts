export type PaginationResponse<T> = { 
    next: T[], 
    cursor: string, 
    last: boolean, 
    count: number,
    message: string
}