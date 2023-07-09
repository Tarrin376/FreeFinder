import { PaginateData } from "./PaginateData";
import { IPost } from "../models/IPost";

export type FilterPosts = {
    cursor: React.MutableRefObject<string | undefined>,
    posts: PaginateData<IPost> | undefined,
    endpoint: string,
    page: { value: number },
    search: string | undefined,
    setPage: React.Dispatch<React.SetStateAction<{ value: number }>>
}