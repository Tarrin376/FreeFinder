import { useRef, useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import { useFetchPosts } from '../../hooks/useFetchPosts';
import SortBy from '../../components/SortBy';
import { sortByParams } from '../../components/SortBy';
import { IPost } from '../../models/IPost';
import PostSkeleton from '../../skeletons/PostSkeleton';
import Post from '../../components/Post';
import PostsWrapper from '../../components/PostsWrapper';

export type savedServicesKey = {
    userID: string,
    postID: string
}

function SavedServicesView() {
    const userContext = useContext(UserContext);
    const [sortBy, setSortBy] = useState<string>(sortByParams["newest arrivals"]);
    const pageRef = useRef<HTMLDivElement>(null);

    const URL = `/users/saved?sort=${sortBy}`;
    const cursor = useRef<savedServicesKey>({ userID: "", postID: "" });

    const [nextPage, setNextPage] = useState<boolean>(false);
    const posts = useFetchPosts(pageRef, userContext.userData.userID, userContext.userData.username, URL, nextPage, setNextPage, cursor);

    return (
        <div className="page" ref={pageRef}>
            <h1 className="text-3xl mb-11">My Saved Services</h1>
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
            <PostsWrapper>
                {posts.posts.map((post: IPost) => {
                    return (
                        <Post 
                            postInfo={post} 
                            userID={userContext.userData.userID} 
                            key={post.postID} 
                        />
                    );
                })}
                {posts.loading && new Array(10).fill(true).map((_, index) => <PostSkeleton key={index} />)}
            </PostsWrapper>
        </div>
    )
}

export default SavedServicesView;