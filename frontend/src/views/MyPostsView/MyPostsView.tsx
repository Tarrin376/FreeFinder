import CreatePost from '../CreatePost/CreatePost';
import { useState, useContext, useRef } from 'react';
import { UserContext } from '../../context/UserContext';
import { useFetchPosts } from '../../hooks/useFetchPosts';
import SortBy from '../../components/SortBy';
import { sortByParams } from '../../components/SortBy';
import { IPost } from '../../models/IPost';
import Post from '../../components/Post';
import PostSkeleton from '../../skeletons/PostSkeleton';
import PostsWrapper from '../../components/PostsWrapper';
import NoResultsFound from '../../components/NoResultsFound';

function MyPostsView() {
    const [postService, setPostService] = useState<boolean>(false);
    const userContext = useContext(UserContext);
    const [sortBy, setSortBy] = useState<string>(sortByParams["most recent"]);
    const pageRef = useRef<HTMLDivElement>(null);
    const [deletingPost, setDeletingPost] = useState<boolean>(false);

    const url = `/api/sellers/posts?sort=${sortBy}`;
    const cursor = useRef<string>("HEAD");
    
    const [nextPage, setNextPage] = useState<boolean>(false);
    const posts = useFetchPosts(pageRef, userContext.userData.userID, userContext.userData.username, url, nextPage, setNextPage, cursor);

    function openPostService(): void {
        if (userContext.userData.username === "") {
            setPostService(true);
        } else {
            setPostService(true);
        }
    }

    return (
        <>
            {postService && 
            <CreatePost 
                setPostService={setPostService} setUserPosts={posts.setPosts} 
                cursor={cursor} setReachedBottom={posts.setReachedBottom} setNextPage={setNextPage}
            />}
            <div ref={pageRef}>
                <h1 className="text-3xl mb-11">My Posts</h1>
                <div className="flex justify-between w-full items-center mb-11">
                    <div className="flex gap-5 w-[35rem] items-stretch">
                        <input type="text" placeholder="Search for post" className="search-bar flex-grow" />
                        <button onClick={openPostService} className="btn-primary text-main-white bg-main-blue w-60 h-[50px] 
                        hover:bg-main-blue-hover">
                            Create new post
                        </button>
                    </div>
                    <SortBy 
                        cursor={cursor} setPosts={posts.setPosts} 
                        setReachedBottom={posts.setReachedBottom} setSortBy={setSortBy}
                        sortBy={sortBy} head={"HEAD"} loading={posts.loading}
                    />
                </div>
                {posts.errorMessage !== "" && !posts.loading && <h1 className="text-3xl">{posts.errorMessage}</h1>}
                {(posts.loading || posts.posts.length > 0) && 
                <PostsWrapper>
                    {posts.posts.map((post: IPost) => {
                        return (
                            <Post 
                                postInfo={post} 
                                userID={userContext.userData.userID} 
                                key={post.postID}
                                canRemove={{
                                    deletingPost: deletingPost,
                                    setDeletingPost: setDeletingPost,
                                }}
                            />
                        );
                    })}
                    {posts.loading && new Array(10).fill(true).map((_, index) => <PostSkeleton key={index} />)}
                </PostsWrapper>}
                {!posts.loading && posts.posts.length === 0 && 
                <NoResultsFound 
                    title="Sorry, we could not find any of your posts." 
                    message="If you are searching for a post, check your spelling and try again."
                 />}
            </div>
        </>
    )
}

export default MyPostsView;