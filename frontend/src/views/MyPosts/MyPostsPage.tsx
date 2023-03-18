import PostServicePopUp from '../../components/PostServicePopUp';
import { useState, useContext, useRef } from 'react';
import { UserContext } from '../../context/UserContext';
import { IUserContext } from '../../context/UserContext';
import Post from '../../components/Post';
import { IPost } from '../../models/IPost';
import PostLoading from '../../components/PostLoading';
import { useFetchPosts } from '../../hooks/useFetchPosts';

function MyPostsPage() {
    const [postService, setPostService] = useState<boolean>(false);
    const userContext: IUserContext = useContext(UserContext);
    const sortByDropdownRef = useRef<HTMLSelectElement>(null);
    const pageRef = useRef<HTMLDivElement>(null);

    const cursor = useRef<string>("HEAD");
    const [nextPage, setNextPage] = useState<boolean>(false);
    const url = `/seller/posts/${userContext.userData.userID}`;
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
            <PostServicePopUp 
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
                        <select className="p-2 bg-main-white rounded-[8px] border border-nav-search-gray cursor-pointer" ref={sortByDropdownRef}>
                            <option>recent</option>
                            <option>Seller rating</option>
                            <option>date posted</option>
                        </select>
                    </div>
                </div>
                {posts.errorMessage !== "" && <h1 className="text-3xl">{posts.errorMessage}</h1>}
                <div className="flex flex-col gap-7 items-center pb-11">
                    <div className="flex items-center gap-[30px] flex-wrap pb-11 w-full">
                        {posts.posts.map((post: IPost) => {
                            return (
                                <Post 
                                    createdAt={new Date(post.createdAt)} 
                                    startingPrice={post.startingPrice} title={post.title}
                                    sellerName={userContext.userData.username}
                                    key={post.postID} profilePicURL={userContext.userData.profilePicURL}
                                    sellerRating={userContext.userData.seller.rating} userID={userContext.userData.userID}
                                    postID={post.postID}
                                />
                            );
                        })}
                        {posts.loading && new Array(10).fill(<PostLoading />)}
                    </div>
                </div>
            </div>
        </>
    )
}

export default MyPostsPage;