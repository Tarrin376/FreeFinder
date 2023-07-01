import { useContext, useState } from 'react';
import { UserContext } from '../../providers/UserContext';
import { IPost } from '../../models/IPost';
import PostSkeleton from '../../skeletons/PostSkeleton';
import Post from '../../components/Post';
import PostsWrapper from '../../wrappers/PostsWrapper';
import NoResultsFound from '../../components/NoResultsFound';
import { useNavigateErrorPage } from '../../hooks/useNavigateErrorPage';
import PageWrapper from '../../wrappers/PageWrapper';
import { FilterPostsContext } from '../../providers/FilterPostsProvider';
import PostsScrollInfo from '../../components/PostsScrollInfo';

function SavedServicesView() {
    const userContext = useContext(UserContext);
    const filterContext = useContext(FilterPostsContext);
    const [deletingPost, setDeletingPost] = useState<boolean>(false);
    
    useNavigateErrorPage("Something isn't quite right...", filterContext?.posts?.errorMessage || "");

    if (!filterContext || !filterContext.posts) {
        return <></>
    }

    return (
        <PageWrapper styles="min-h-[calc(100vh-180px)]">
            <h1 className="text-2xl mb-6">My Saved Posts</h1>
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
                <PostsScrollInfo posts={filterContext.posts} page={filterContext.page.value} />
            </PostsWrapper>}
            {!filterContext.posts.loading && filterContext.posts.allPosts.length === 0 &&
            <NoResultsFound 
                title="Sorry, we could not find any of your saved posts."
                message="If you are searching for a post, please check your filters and try again."
            />}
        </PageWrapper>
    )
}

export default SavedServicesView;