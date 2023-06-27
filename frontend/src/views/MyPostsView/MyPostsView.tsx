import CreatePost from '../CreatePost/CreatePost';
import { useState, useContext, useRef } from 'react';
import { UserContext } from '../../context/UserContext';
import { usePaginateData } from '../../hooks/usePaginateData';
import SortBy from '../../components/SortBy';
import { IPost } from '../../models/IPost';
import Post from '../../components/Post';
import PostSkeleton from '../../skeletons/PostSkeleton';
import PostsWrapper from '../../components/PostsWrapper';
import NoResultsFound from '../../components/NoResultsFound';
import { sortPosts } from '../../utils/sortPosts';
import { useNavigateErrorPage } from '../../hooks/useNavigateErrorPage';
import { useLocation } from 'react-router-dom';

function MyPostsView() {
    const [postService, setPostService] = useState<boolean>(false);
    const userContext = useContext(UserContext);
    const [sortBy, setSortBy] = useState<string>(sortPosts["most recent"]);
    const pageRef = useRef<HTMLDivElement>(null);
    const [deletingPost, setDeletingPost] = useState<boolean>(false);
    const cursor = useRef<string>("");
    const location = useLocation();
    
    const [nextPage, setNextPage] = useState<boolean>(false);
    const posts = usePaginateData<IPost>(pageRef, `/api/sellers${location.pathname}?sort=${sortBy}`, nextPage, setNextPage, cursor);

    function openPostService(): void {
        setPostService(true);
    }

    useNavigateErrorPage("Uh oh!", posts.errorMessage);

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
                                username={userContext.userData.username} 
                                key={post.postID}
                                canRemove={{
                                    deletingPost: deletingPost,
                                    setDeletingPost: setDeletingPost,
                                    removeURL: `/api/posts/`
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