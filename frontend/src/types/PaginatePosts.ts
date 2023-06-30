export type PaginatePosts<T> = {
    allPosts: T[],
    errorMessage: string,
    loading: boolean,
    reachedBottom: boolean,
    resetState: () => void,
    goToNextPage: () => void
}