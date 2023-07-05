export type PaginatePosts<T> = {
    allPosts: T[],
    errorMessage: string,
    loading: boolean,
    reachedBottom: boolean,
    count: number,
    resetState: () => void,
    goToNextPage: () => void
}