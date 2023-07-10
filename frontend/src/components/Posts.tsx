import { useContext } from 'react';
import { IPost } from '../models/IPost';
import Post from './Post';
import PostSkeleton from '../skeletons/PostSkeleton';
import PostsWrapper from '../wrappers/PostsWrapper';
import NoResultsFound from './NoResultsFound';
import { useNavigateErrorPage } from '../hooks/useNavigateErrorPage';
import { FilterPostsContext } from '../providers/FilterPostsProvider';
import PageWrapper from '../wrappers/PageWrapper';
import PaginationScrollInfo from './PaginationScrollInfo';
import { limit } from '../hooks/usePaginateData';

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
    useNavigateErrorPage("Something isn't quite right...", filterContext?.posts?.errorMessage || "");

    if (!filterContext || !filterContext.posts) {
        return <></>
    }

    return (
        <PageWrapper styles="!min-h-[calc(100vh-180px)] xxl:max-w-[1430px] xl:max-w-[1202px] lg:max-w-[910px] md:max-w-[618px]">
            {filterContext.posts.loading ? 
            <h1 className="text-[20px] mb-6">
                Finding services...
            </h1> :
            <h1 className="text-[20px] mb-6">
                {`${filterContext.posts.loading ? "Loading results for" : `${filterContext.posts.count}
                ${filterContext.posts.count === 1 ? " result" : " results"} found`}${filterContext.search ? ` for '${filterContext.search}'` : ""}`}
            </h1>}
            {(filterContext.posts.loading || filterContext.posts.data.length > 0) && 
            <PostsWrapper>
                {filterContext.posts.data.map((post: IPost) => {
                    return (
                        <Post 
                            postInfo={post} 
                            canRemove={canRemove}
                            key={post.postID}
                        />
                    );
                })}
                {filterContext.posts.loading && new Array(limit).fill(true).map((_, i) => <PostSkeleton key={i} />)}
                <PaginationScrollInfo 
                    data={filterContext.posts} 
                    page={filterContext.page.value}
                    styles="mt-7 mb-7"
                />
            </PostsWrapper>}
            {!filterContext.posts.loading && filterContext.posts.data.length === 0 &&
            <NoResultsFound 
                title={noResultsFoundTitle}
                message="If you are searching for a post, please check your filters and try again."
            />}
        </PageWrapper>
    )
}

export default Posts;