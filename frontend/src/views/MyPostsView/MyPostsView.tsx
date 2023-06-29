import CreatePost from '../CreatePost/CreatePost';
import { useState, useContext } from 'react';
import { UserContext } from '../../providers/UserContext';
import { IPost } from '../../models/IPost';
import Post from '../../components/Post';
import PostSkeleton from '../../skeletons/PostSkeleton';
import PostsWrapper from '../../wrappers/PostsWrapper';
import NoResultsFound from '../../components/NoResultsFound';
import { useNavigateErrorPage } from '../../hooks/useNavigateErrorPage';
import { FilterPostsContext } from '../../providers/FilterPostsContext';
import PageWrapper from '../../wrappers/PageWrapper';

function MyPostsView() {
    const userContext = useContext(UserContext);
    const filterContext = useContext(FilterPostsContext);

    const [postService, setPostService] = useState<boolean>(false);
    const [deletingPost, setDeletingPost] = useState<boolean>(false);

    function openPostService(): void {
        setPostService(true);
    }

    useNavigateErrorPage("Something isn't quite right...", filterContext?.posts?.errorMessage || "");

    if (!filterContext || !filterContext.posts) {
        return <></>
    }

    return (
        <>
            {postService && 
            <CreatePost 
                setPostService={setPostService} 
                resetState={filterContext.posts.resetState}
            />}
            <PageWrapper>
                <h1 className="text-2xl mb-6">My Posts</h1>
                <button onClick={openPostService} className="btn-primary text-main-white bg-main-blue w-fit px-5 h-[45px] 
                hover:bg-main-blue-hover block mb-12">
                    Create new post
                </button>
                {(filterContext.posts.loading || filterContext.posts.allPosts.length > 0) && 
                <PostsWrapper>
                    {filterContext.posts.allPosts.map((post: IPost) => {
                        return (
                            <Post 
                                postInfo={post} 
                                username={userContext.userData.username} 
                                key={post.postID}
                                canRemove={{
                                    deletingPost: deletingPost,
                                    setDeletingPost: setDeletingPost,
                                    removeURL: `/api/posts`
                                }}
                            />
                        );
                    })}
                    {filterContext.posts.loading && new Array(10).fill(true).map((_, index) => <PostSkeleton key={index} />)}
                </PostsWrapper>}
                {!filterContext.posts.loading && filterContext.posts.allPosts.length === 0 &&
                <NoResultsFound 
                    title="Sorry, we could not find any of your posts."
                    message="If you are searching for a post, check your spelling and try again."
                />}
                {!filterContext.posts.loading && 
                filterContext.nextPage.pageNumber % 2 === 0 && 
                !filterContext.posts.reachedBottom &&
                <button className="m-auto block side-btn w-fit" onClick={filterContext.posts.goToNextPage}>
                    Show more results
                </button>}
                {!filterContext.posts.loading && 
                filterContext.posts.reachedBottom && 
                filterContext.posts.allPosts.length > 0 &&
                <p className="text-center text-side-text-gray">
                    You've reached the end of the list.
                </p>}
            </PageWrapper>
        </>
    )
}

export default MyPostsView;