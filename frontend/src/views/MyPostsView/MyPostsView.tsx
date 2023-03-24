import CreatePost from '../CreatePost/CreatePost';
import { useState, useContext, useRef } from 'react';
import { UserContext } from '../../context/UserContext';
import { useFetchPosts } from '../../hooks/useFetchPosts';
import SortBy from '../../components/SortBy';
import { sortByParams } from '../../components/SortBy';
import { IPost } from '../../models/IPost';
import Post from '../../components/Post';
import PostSkeleton from '../../skeletons/PostSkeleton';

function MyPostsView() {
    const [postService, setPostService] = useState<boolean>(false);
    const userContext = useContext(UserContext);
    const [sortBy, setSortBy] = useState<string>(sortByParams["newest arrivals"]);
    const pageRef = useRef<HTMLDivElement>(null);
    const [deletingPost, setDeletingPost] = useState<boolean>(false);

    const URL = `/sellers/posts?sort=${sortBy}`;
    const cursor = useRef<string>("HEAD");
    
    const [nextPage, setNextPage] = useState<boolean>(false);
    const posts = useFetchPosts(pageRef, userContext.userData.userID, userContext.userData.username, URL, nextPage, setNextPage, cursor);

    function openPostService(): void {
        if (userContext.userData.username === "") {
            setPostService(true);
        } else {
            setPostService(true);
        }
    }

    async function deletePost(postID: string) {
        if (deletingPost) {
            return;
        }

        try {
            setDeletingPost(true);
            const response = await fetch("/posts/delete", {
                method: "DELETE",
                body: JSON.stringify({
                    postID
                }),
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            });

            if (response.status !== 500) {
                const removed = await response.json();
                if (removed.message === "success") {
                    posts.setPosts((state) => state.filter((x) => x.postID !== postID));
                } else {
                    console.log(removed.message);
                }
            } else {
                console.log("Error");
            }
        }
        catch (err: any) {
            console.log(err.message);
        }
        finally {
            setDeletingPost(false);
        }
    }

    return (
        <>
            {postService && 
            <CreatePost 
                setPostService={setPostService} setUserPosts={posts.setPosts} 
                cursor={cursor} setReachedBottom={posts.setReachedBottom} setNextPage={setNextPage}
            />}
            <div className="page" ref={pageRef}>
                <h1 className="text-3xl mb-11">My Posts</h1>
                <div className="flex justify-between w-full items-center mb-11">
                    <div className="flex gap-5 w-[35rem] items-stretch">
                        <input type="text" placeholder="Search for post" className="search-bar flex-grow" />
                        <button onClick={openPostService} className="btn-primary text-main-white bg-main-purple w-60 h-[50px] 
                        hover:bg-main-purple-hover">Create new post</button>
                    </div>
                    <SortBy 
                        cursor={cursor} setPosts={posts.setPosts} 
                        setReachedBottom={posts.setReachedBottom} setSortBy={setSortBy}
                        sortBy={sortBy} head={"HEAD"} loading={posts.loading}
                    />
                </div>
                {posts.errorMessage !== "" && !posts.loading && <h1 className="text-3xl">{posts.errorMessage}</h1>}
                <div className="flex flex-col gap-7 items-center pb-11">
                    <div className="flex gap-[30px] items-start flex-wrap pb-11 w-full">
                        {posts.posts.map((post: IPost) => {
                            return (
                                <Post postInfo={post} userID={userContext.userData.userID} key={post.postID}>
                                    <button className="bg-main-black hover:bg-main-black-hover btn-primary 
                                    p-1 px-2 h-fit cursor-pointer text-main-white text-[15px]" onClick={() => deletePost(post.postID)}>
                                        Remove
                                    </button>
                                </Post>
                            );
                        })}
                        {posts.loading && new Array(10).fill(true).map((_, index) => <PostSkeleton key={index} />)}
                    </div>
                </div>
            </div>
        </>
    )
}

export default MyPostsView;