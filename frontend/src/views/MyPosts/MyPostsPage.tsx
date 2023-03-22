import CreatePostPopUp from '../../components/CreatePostPopUp';
import { useState, useContext, useRef } from 'react';
import { UserContext } from '../../context/UserContext';
import { IUserContext } from '../../context/UserContext';
import { useFetchPosts } from '../../hooks/useFetchPosts';
import Posts from '../../components/Posts';

function MyPostsPage() {
    const [postService, setPostService] = useState<boolean>(false);
    const userContext: IUserContext = useContext(UserContext);
    const sortByDropdownRef = useRef<HTMLSelectElement>(null);
    const pageRef = useRef<HTMLDivElement>(null);

    const cursor = useRef<string>("HEAD");
    const [nextPage, setNextPage] = useState<boolean>(false);
    const url = "/sellers/posts";
    const posts = useFetchPosts(pageRef, userContext, url, nextPage, setNextPage, cursor);

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
            <CreatePostPopUp 
                setPostService={setPostService} setUserPosts={posts.setPosts} 
                cursor={cursor} setReachedBottom={posts.setReachedBottom} setNextPage={setNextPage}
            />}
            <div className="page" ref={pageRef}>
                <h1 className="text-3xl mb-11">My Posts</h1>
                <div className="flex justify-between w-full items-center mb-11">
                    <div className="flex gap-5 w-[35rem] items-stretch">
                        <input type="text" placeholder="Search by term" className="search-bar flex-grow" />
                        <button onClick={openPostService} className="btn-primary text-main-white bg-main-purple w-60 h-[50px] 
                        hover:bg-main-purple-hover">Create new post</button>
                    </div>
                    <div className="flex items-center gap-4">
                        <p>Sort by</p>
                        <select className="p-2 bg-main-white rounded-[8px] border-2 border-light-gray cursor-pointer" ref={sortByDropdownRef}>
                            <option>recent</option>
                            <option>Seller rating</option>
                            <option>date posted</option>
                        </select>
                    </div>
                </div>
                {posts.errorMessage !== "" && <h1 className="text-3xl">{posts.errorMessage}</h1>}
                <Posts posts={posts.posts} loading={posts.loading} userID={userContext.userData.userID} />
            </div>
        </>
    )
}

export default MyPostsPage;