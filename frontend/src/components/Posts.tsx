import { IListing } from "../models/IListing";
import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";

interface PostsProps {
    posts: IListing[],
    loading: boolean,
    userID: string
}

function Posts({ posts, loading, userID }: PostsProps) {
    return (
        <div className="flex flex-col gap-7 items-center pb-11">
            <div className="flex gap-[30px] items-start flex-wrap pb-11 w-full">
                {posts.map((post: IListing) => {
                    return (
                        <Post postInfo={post} userID={userID} key={post.postID} />
                    );
                })}
                {loading && new Array(10).fill(<PostSkeleton />)}
            </div>
        </div>
    );
}

export default Posts;