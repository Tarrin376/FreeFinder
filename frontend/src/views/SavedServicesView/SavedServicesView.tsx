import { useContext, useState } from 'react';
import { UserContext } from '../../providers/UserContext';
import { IPost } from '../../models/IPost';
import PostSkeleton from '../../skeletons/PostSkeleton';
import Post from '../../components/Post';
import PostsWrapper from '../../wrappers/PostsWrapper';
import NoResultsFound from '../../components/NoResultsFound';
import { useNavigateErrorPage } from '../../hooks/useNavigateErrorPage';
import PageWrapper from '../../wrappers/PageWrapper';
import { FilterPostsContext } from '../../providers/FilterPostsContext';

function SavedServicesView() {
    const userContext = useContext(UserContext);
    const filterContext = useContext(FilterPostsContext);
    const [deletingPost, setDeletingPost] = useState<boolean>(false);
    
    useNavigateErrorPage("Something isn't quite right...", filterContext?.posts?.errorMessage || "");

    if (!filterContext || !filterContext.posts) {
        return <></>
    }

    return (
        <PageWrapper>
            <h1 className="text-2xl mb-11">My Saved Posts</h1>
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
                                removeURL: filterContext.endpoint,
                                unsave: true
                            }}
                        />
                    );
                })}
                {filterContext.posts.loading && new Array(10).fill(true).map((_, index) => <PostSkeleton key={index} />)}
            </PostsWrapper>}
            {!filterContext.posts.loading && filterContext.posts.allPosts.length === 0 &&
            <NoResultsFound 
                title="Sorry, we could not find any of your saved posts."
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
    )
}

export default SavedServicesView;