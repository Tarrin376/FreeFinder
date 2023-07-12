export type PaginateData<T> = {
    data: T[],
    errorMessage: string,
    loading: boolean,
    reachedBottom: boolean,
    count: React.MutableRefObject<number>,
    resetState: () => void,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
    goToNextPage: () => void
}