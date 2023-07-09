export type PaginateData<T> = {
    data: T[],
    errorMessage: string,
    loading: boolean,
    reachedBottom: boolean,
    count: number,
    resetState: () => void,
    goToNextPage: () => void
}