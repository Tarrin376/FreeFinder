import { useContext } from 'react';
import { IPost } from '../models/IPost';
import Post from './Post';
import PostSkeleton from '../skeletons/PostSkeleton';
import PostsWrapper from '../wrappers/PostsWrapper';
import NoResultsFound from './NoResultsFound';
import { useNavigateErrorPage } from '../hooks/useNavigateErrorPage';
import { FilterPostsContext } from '../providers/FilterPostsProvider';
import PageWrapper from '../wrappers/PageWrapper';
import PostsScrollInfo from './PostsScrollInfo';
import { UserContext } from '../providers/UserContext';

const paginationLimit = 20;

interface PostsProps {
    canRemove?: {
        deletingPost: boolean;
        setDeletingPost: React.Dispatch<React.SetStateAction<boolean>>;
        removeURL: string;
        unsave?: boolean;
    },
    noResultsFoundTitle: string
}

function Posts({ canRemove, noResultsFoundTitle }: PostsProps) {
    const filterContext = useContext(FilterPostsContext);
    const userContext = useContext(UserContext);
    useNavigateErrorPage("Something isn't quite right...", filterContext?.posts?.errorMessage || "");

    if (!filterContext || !filterContext.posts) {
        return <></>
    }

    return (
        <PageWrapper styles="min-h-[calc(100vh-180px)] xxl:max-w-[1494px] xl:max-w-[1202px] lg:max-w-[910px] md:max-w-[618px]">
            {filterContext.posts.loading ? 
            <h1 className="text-[20px] mb-6">
                Loading results...
            </h1> :
            <h1 className="text-[20px] mb-6">
                {`${filterContext.posts.count} ${filterContext.posts.count === 1 ? "service" : "services"} found`}
                {filterContext.search && 
                <span className="text-[20px]">
                    {` for `}
                    <span className="font-bold text-[20px]">{filterContext.search}</span>
                </span>}
            </h1>}
            {(filterContext.posts.loading || filterContext.posts.allPosts.length > 0) && 
            <PostsWrapper>
                {filterContext.posts.allPosts.map((post: IPost) => {
                    return (
                        <Post 
                            postInfo={post} 
                            username={userContext.userData.username} 
                            canRemove={canRemove}
                            key={post.postID}
                        />
                    );
                })}
                {filterContext.posts.loading && new Array(paginationLimit).fill(true).map((_, index) => <PostSkeleton key={index} />)}
                <PostsScrollInfo posts={filterContext.posts} page={filterContext.page.value} />
            </PostsWrapper>}
            {!filterContext.posts.loading && filterContext.posts.allPosts.length === 0 &&
            <NoResultsFound 
                title={noResultsFoundTitle}
                message="If you are searching for a post, please check your filters and try again."
            />}
        </PageWrapper>
    )
}

export default Posts;