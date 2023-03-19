import { IPost } from "../models/IPost";
import Post from "./Post";
import PostLoading from "./PostLoading";

function Posts({ posts, loading, userID }: { posts: IPost[], loading: boolean, userID: string }) {
    return (
        <div className="flex flex-col gap-7 items-center pb-11">
            <div className="flex items-center gap-[30px] flex-wrap pb-11 w-full">
                {posts.map((post: IPost) => {
                    return (
                        <Post sellerInfo={post} userID={userID} />
                    );
                })}
                {loading && new Array(10).fill(<PostLoading />)}
            </div>
        </div>
    );
}

export default Posts;