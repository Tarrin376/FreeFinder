export type PaginateData<T> = {
    allPosts: T[],
    errorMessage: string,
    loading: boolean,
    nextPage: { pageNumber: number },
    reachedBottom: boolean,
    resetState: () => void,
    goToNextPage: () => void
}