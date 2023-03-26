import { useRef, useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import { useFetchPosts } from '../../hooks/useFetchPosts';
import SortBy from '../../components/SortBy';
import { sortByParams } from '../../components/SortBy';
import { IPost } from '../../models/IPost';
import PostSkeleton from '../../skeletons/PostSkeleton';
import Post from '../../components/Post';
import PostsWrapper from '../../components/PostsWrapper';

export type savedServicesKey = {
    userID: string,
    postID: string
}

function SavedServicesView() {
    const userContext = useContext(UserContext);
    const [sortBy, setSortBy] = useState<string>(sortByParams["most recent"]);
    const pageRef = useRef<HTMLDivElement>(null);

    const URL = `/saved-posts/get-posts?sort=${sortBy}`;
    const cursor = useRef<savedServicesKey>({ userID: "", postID: "" });
    const [deletingPost, setDeletingPost] = useState<boolean>(false);

    const [nextPage, setNextPage] = useState<boolean>(false);
    const posts = useFetchPosts(pageRef, userContext.userData.userID, userContext.userData.username, URL, nextPage, setNextPage, cursor);

    async function removePost(postID: string) {
        if (deletingPost) {
            return;
        }

        setDeletingPost(true);
        try {
            const response = await fetch("/saved-posts/delete", {
                method: "DELETE",
                body: JSON.stringify({
                    postID: postID,
                    userID: userContext.userData.userID
                }),
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 500) {
                console.log(`Looks like we are having trouble on our end. Please try again later. 
                (Error code: ${response.status})`);
            } else if (response.status === 403) {
                console.log("You do not have authorisation to perform this action");
            } else {
                const deleted = await response.json();
                if (deleted.message === "success") {
                    posts.setPosts((state) => state.filter((x) => x.postID !== postID));
                } else {
                    console.log(deleted.message);
                }
            }
        }
        catch (err: any) {
            console.log(err.message);
        }
    }

    return (
        <div className="page" ref={pageRef}>
            <h1 className="text-3xl mb-11">My Saved Posts</h1>
            <div className="flex justify-between w-full items-center mb-11">
                <div className="flex gap-5 w-[35rem] items-stretch">
                    <input type="text" placeholder="Search for post" className="search-bar flex-grow" />
                </div>
                <SortBy 
                    cursor={cursor} sortBy={sortBy} 
                    setPosts={posts.setPosts} setReachedBottom={posts.setReachedBottom} 
                    setSortBy={setSortBy} head={{ userID: "", postID: "" }} loading={posts.loading}
                />
            </div>
            {posts.errorMessage !== "" && !posts.loading && <h1 className="text-3xl">{posts.errorMessage}</h1>}
            <PostsWrapper>
                {posts.posts.map((post: IPost) => {
                    return (
                        <Post postInfo={post} userID={userContext.userData.userID} key={post.postID}>
                            <button className="bg-error-red text-error-text hover:bg-error-red-hover btn-primary 
                            p-[3px] px-[8px] h-fit cursor-pointer text-[15px]" onClick={() => removePost(post.postID)}>
                                Remove
                            </button>
                        </Post>
                    );
                })}
                {posts.loading && new Array(10).fill(true).map((_, index) => <PostSkeleton key={index} />)}
            </PostsWrapper>
        </div>
    )
}

export default SavedServicesView;