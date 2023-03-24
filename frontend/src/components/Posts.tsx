import { IPost } from "../models/IPost";
import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";

interface PostsProps {
    posts: IPost[],
    loading: boolean,
    userID: string,
    areUserPosts: boolean
}

function Posts({ posts, loading, userID, areUserPosts }: PostsProps) {
    return (
        <div className="flex flex-col gap-7 items-center pb-11">
            <div className="flex gap-[30px] items-start flex-wrap pb-11 w-full">
                {posts.map((post: IPost) => {
                    return (
                        <Post postInfo={post} userID={userID} key={post.postID} isUserPost={areUserPosts} />
                    );
                })}
                {loading && new Array(10).fill(<PostSkeleton />)}
            </div>
        </div>
    );
}

export default Posts;