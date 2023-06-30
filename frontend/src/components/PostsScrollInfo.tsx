import { PaginatePosts } from "../types/PaginatePosts";
import { IPost } from "../models/IPost";
import { MOD } from "../hooks/useScrollEvent";

interface PostScrollInfoProps {
    posts: PaginatePosts<IPost>,
    page: number
}

function PostsScrollInfo({ posts, page }: PostScrollInfoProps) {
    return (
        <div className="mt-7 mb-7 w-full">
            {!posts.loading && page % MOD === 0 && !posts.reachedBottom &&
            <button className="m-auto block side-btn w-fit" onClick={posts.goToNextPage}>
                Show more results
            </button>}
            {!posts.loading && posts.reachedBottom && posts.allPosts.length > 0 &&
            <p className="text-center text-side-text-gray">
                You've reached the end of the list.
            </p>}
        </div>
    )
}

export default PostsScrollInfo;