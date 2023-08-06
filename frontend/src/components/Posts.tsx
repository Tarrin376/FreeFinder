import { useContext } from 'react';
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
    canRemove?: CanRemovePost,
    noResultsFoundTitle: string,
    title?: string
}

function Posts({ canRemove, noResultsFoundTitle, title }: PostsProps) {
    const filterContext = useContext(FilterPostsContext);

    if (!filterContext || !filterContext.posts) {
        return <></>
    }

    return (
        <PageWrapper styles="!min-h-[calc(100vh-180px)] xxl:max-w-[1430px] xl:max-w-[1075px] lg:max-w-[720px] md:max-w-[358px]">
            {title && <h1 className="text-[20px] mb-6">{title}</h1>}
            {filterContext.posts.loading ? 
            <h1 className="text-side-text-gray text-[17px] mb-5">
                Finding services...
            </h1> :
            <h1 className="text-side-text-gray text-[17px] mb-5">
                {`${filterContext.posts.loading ? "Loading results for" : `${filterContext.posts.count.current}
                ${filterContext.posts.count.current === 1 ? " result" : " results"} found`}${filterContext.search ? ` for '${filterContext.search}'` : ""}`}
            </h1>}
            {(filterContext.posts.loading || filterContext.posts.data.length > 0) && 
            <PostsWrapper>
                {filterContext.posts.data.map((post: IPost, index: number) => {
                    return (
                        <Post 
                            postInfo={post} 
                            index={index}
                            canRemove={canRemove}
                            key={index}
                            count={filterContext!.posts!.count}
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