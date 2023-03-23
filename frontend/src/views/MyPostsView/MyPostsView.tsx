import CreatePost from '../CreatePost/CreatePost';
import { useState, useContext, useRef } from 'react';
import { UserContext } from '../../context/UserContext';
import { useFetchPosts } from '../../hooks/useFetchPosts';
import Posts from '../../components/Posts';
import SortBy from '../../components/SortBy';
import { sortByParams } from '../../components/SortBy';

function MyPostsView() {
    const [postService, setPostService] = useState<boolean>(false);
    const userContext = useContext(UserContext);
    const [sortBy, setSortBy] = useState<string>(sortByParams[0]);
    const pageRef = useRef<HTMLDivElement>(null);

    const URL = `/sellers/posts?sort=${sortBy}`;
    const cursor = useRef<string>("HEAD");
    
    const [nextPage, setNextPage] = useState<boolean>(false);
    const posts = useFetchPosts(pageRef, userContext.userData.userID, userContext.userData.username, URL, nextPage, setNextPage, cursor);

    function openPostService(): void {
        if (userContext.userData.username === "") {
            setPostService(true);
        } else {
            setPostService(true);
        }
    }

    return (
        <>
            {postService && 
            <CreatePost 
                setPostService={setPostService} setUserPosts={posts.setPosts} 
                cursor={cursor} setReachedBottom={posts.setReachedBottom} setNextPage={setNextPage}
            />}
            <div className="page" ref={pageRef}>
                <h1 className="text-3xl mb-11">My Posts</h1>
                <div className="flex justify-between w-full items-center mb-11">
                    <div className="flex gap-5 w-[35rem] items-stretch">
                        <input type="text" placeholder="Search for post" className="search-bar flex-grow" />
                        <button onClick={openPostService} className="btn-primary text-main-white bg-main-purple w-60 h-[50px] 
                        hover:bg-main-purple-hover">Create new post</button>
                    </div>
                    <div className="flex items-center gap-4">
                        <p>Sort by</p>
                        <SortBy 
                            cursor={cursor} setPosts={posts.setPosts} 
                            setReachedBottom={posts.setReachedBottom} setSortBy={setSortBy} 
                        />
                    </div>
                </div>
                {posts.errorMessage !== "" && !posts.loading && <h1 className="text-3xl">{posts.errorMessage}</h1>}
                <Posts posts={posts.posts} loading={posts.loading} userID={userContext.userData.userID} />
            </div>
        </>
    )
}

export default MyPostsView;