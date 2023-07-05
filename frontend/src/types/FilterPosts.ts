import { PaginatePosts } from "./PaginatePosts";
import { IPost } from "../models/IPost";

export type FilterPosts = {
    cursor: React.MutableRefObject<string | undefined>,
    posts: PaginatePosts<IPost> | undefined,
    endpoint: string,
    page: { value: number },
    search: string | undefined,
    setPage: React.Dispatch<React.SetStateAction<{ value: number }>>
}