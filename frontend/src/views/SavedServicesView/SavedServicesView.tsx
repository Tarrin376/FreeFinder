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
    const filterPostsContext = useContext(FilterPostsContext);

    const [deletingPost, setDeletingPost] = useState<boolean>(false);
    useNavigateErrorPage("Uh oh!", filterPostsContext?.posts?.errorMessage || "");

    if (!filterPostsContext || !filterPostsContext.posts) {
        return <></>
    }

    return (
        <PageWrapper>
            <h1 className="text-2xl mb-11">My Saved Posts</h1>
            {(filterPostsContext.posts.loading || filterPostsContext.posts.posts.length > 0) && 
            <PostsWrapper>
                {filterPostsContext.posts.posts.map((post: IPost) => {
                    return (
                        <Post 
                            postInfo={post} 
                            username={userContext.userData.username}
                            key={post.postID}
                            canRemove={{
                                deletingPost: deletingPost,
                                setDeletingPost: setDeletingPost,
                                removeURL: filterPostsContext.endpoint,
                                unsave: true
                            }}
                        />
                    );
                })}
                {filterPostsContext.posts.loading && new Array(10).fill(true).map((_, index) => <PostSkeleton key={index} />)}
            </PostsWrapper>}
            {!filterPostsContext.posts.loading && filterPostsContext.posts.posts.length === 0 &&
            <NoResultsFound 
                title="Sorry, we could not find any of your saved posts."
                message="If you are searching for a post, check your spelling and try again."
            />}
        </PageWrapper>
    )
}

export default SavedServicesView;