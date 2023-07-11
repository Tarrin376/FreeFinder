export type PaginateData<T> = {
    data: T[],
    errorMessage: string,
    loading: boolean,
    reachedBottom: boolean,
    count: React.MutableRefObject<number>,
    resetState: () => void,
    goToNextPage: () => void
}