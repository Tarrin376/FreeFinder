import { useContext, memo } from 'react';
import { IPost } from '../models/IPost';
import Post from './Post';
import PostSkeleton from '../skeletons/PostSkeleton';
import PostsWrapper from '../wrappers/PostsWrapper';
import NoResultsFound from './NoResultsFound';
import { FilterPostsContext } from '../providers/FilterPostsProvider';
import PageWrapper from '../wrappers/PageWrapper';
import PaginationScrollInfo from './PaginationScrollInfo';
import { limit } from '../hooks/usePaginateData';
import { CanRemovePost } from '../types/CanRemovePost';

interface PostsProps {
    noResultsFoundTitle: string,
    posts: IPost[] | undefined,
    loading: boolean,
    count: React.MutableRefObject<number> | undefined,
    canRemove?: CanRemovePost,
    title?: string
}

function Posts({ noResultsFoundTitle, posts, loading, count, canRemove, title }: PostsProps) {
    const filterContext = useContext(FilterPostsContext);

    if (!filterContext || !filterContext.posts || !posts || !count) {
        return <></>
    }

    return (
        <PageWrapper styles="!min-h-[calc(100vh-180px)] max-w-[1430px]">
            {title && <h1 className="text-[18px] mb-5">{title}</h1>}
            {loading ? 
            <h1 className="text-side-text-gray mb-5">
                Finding services...
            </h1> :
            <h1 className="text-side-text-gray mb-5">
                {`${loading ? "Loading results for" : `${count.current}
                ${count.current === 1 ? " result" : " results"} found`}`}
            </h1>}
            {(loading || posts.length > 0) && 
            <PostsWrapper>
                {posts.map((post: IPost, index: number) => {
                    return (
                        <Post 
                            postInfo={post} 
                            index={index}
                            canRemove={canRemove}
                            key={index}
                            count={count}
                        />
                    );
                })}
                {loading && new Array(limit).fill(true).map((_, i) => <PostSkeleton key={i} />)}
            </PostsWrapper>}
            <PaginationScrollInfo 
                data={filterContext.posts} 
                page={filterContext.page.value}
                styles="mt-7 mb-7"
            />
            {!loading && posts.length === 0 &&
            <NoResultsFound 
                title={noResultsFoundTitle}
                message="If you are searching for a post, please check your filters and try again."
            />}
        </PageWrapper>
    )
}

export default memo(Posts);