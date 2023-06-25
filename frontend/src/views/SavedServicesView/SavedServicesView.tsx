import { useRef, useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import { useFetchPosts } from '../../hooks/useFetchPosts';
import SortBy from '../../components/SortBy';
import { IPost } from '../../models/IPost';
import PostSkeleton from '../../skeletons/PostSkeleton';
import Post from '../../components/Post';
import PostsWrapper from '../../components/PostsWrapper';
import NoResultsFound from '../../components/NoResultsFound';
import { SavedServicesKey } from '../../types/SavedServicesKey';
import { sortPosts } from '../../utils/sortPosts';

function SavedServicesView() {
    const userContext = useContext(UserContext);
    const [sortBy, setSortBy] = useState<string>(sortPosts["most recent"]);
    const pageRef = useRef<HTMLDivElement>(null);

    const url = `/api/users/${userContext.userData.userID}/saved-posts?sort=${sortBy}`;
    const cursor = useRef<SavedServicesKey>({ userID: "", postID: "" });
    const [deletingPost, setDeletingPost] = useState<boolean>(false);

    const [nextPage, setNextPage] = useState<boolean>(false);
    const posts = useFetchPosts(pageRef, url, nextPage, setNextPage, cursor);

    return (
        <div ref={pageRef}>
            <h1 className="text-3xl mb-11">My Saved Posts</h1>
            <div className="flex justify-between w-full items-center mb-11">
                <div className="flex gap-5 w-[35rem] items-stretch">
                    <input type="text" placeholder="Search for post" className="search-bar flex-grow" />
                </div>
                <SortBy 
                    cursor={cursor} sortBy={sortBy} 
                    setPosts={posts.setPosts} setReachedBottom={posts.setReachedBottom} 
                    setSortBy={setSortBy} head={{ userID: "", postID: "" }} loading={posts.loading}
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
                title="Sorry, we could not find any of your saved posts."
                message="If you are searching for a post, check your spelling and try again."
            />}
        </div>
    )
}

export default SavedServicesView;