export type PaginateData<T> = {
    posts: T[],
    errorMessage: string,
    loading: boolean,
    setReachedBottom: React.Dispatch<React.SetStateAction<boolean>>,
    setNextPage: React.Dispatch<React.SetStateAction<boolean>>,
    setPosts: React.Dispatch<React.SetStateAction<T[]>>
}