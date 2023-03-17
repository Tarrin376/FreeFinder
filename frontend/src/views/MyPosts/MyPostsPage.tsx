import PostServicePopUp from '../../components/PostServicePopUp';
import { useState, useContext, useEffect, useRef } from 'react';
import { UserContext } from '../../context/UserContext';
import { IUserContext } from '../../context/UserContext';
import Post from '../../components/Post';
import { IPost } from '../../models/IPost';
import { fetchPosts } from '../../utils/fetchPosts';
import PostLoading from '../../components/PostLoading';
import { useNavigate } from 'react-router-dom';

function MyPostsPage() {
    const [postService, setPostService] = useState<boolean>(false);
    const [nextPage, setNextPage] = useState<boolean>(false);
    const userContext: IUserContext = useContext(UserContext);
    const [userPosts, setUserPosts] = useState<IPost[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [reachedBottom, setReachedBottom] = useState<boolean>(false);
    const navigate = useNavigate();

    const sortByDropdownRef = useRef<HTMLSelectElement>(null);
    const pageRef = useRef<HTMLDivElement>(null);
    const cursor = useRef<string>("HEAD");

    function openPostService(): void {
        if (userContext.userData.username === "") {
            setPostService(true);
        } else {
            setPostService(true);
        }
    }

    function loadMoreContent(): void {
        let documentHeight = document.body.scrollHeight;
        let currentScroll = window.scrollY + window.innerHeight;

        if (currentScroll >= documentHeight && !reachedBottom && !loading) {
            setNextPage((state) => !state);
        }
    }

    useEffect(() => {
        if (userContext.userData.username === "") {
            navigate("/");
        }

        if (pageRef && pageRef.current) {
            pageRef.current.addEventListener('wheel', loadMoreContent);
        }

        const cur = pageRef.current;
        return () => {
            if (pageRef && cur) {
                cur.removeEventListener('wheel', loadMoreContent);
            }
        }
    });

    useEffect(() => {
        try {
            setLoading(true);
            setTimeout(() => {
                fetchPosts(userContext.userData.userID, setUserPosts, cursor.current)
                .then((next) => {
                    if (next === cursor.current) setReachedBottom(true);
                    else cursor.current = next;
                    setErrorMessage("");
                    setLoading(false);
                }).catch((err: any) => { 
                    setErrorMessage(err.message);
                    setLoading(false);
                });
            }, 2000);
        }
        catch(err: any) {
            setErrorMessage(err.message);
        }
    }, [nextPage, userContext.userData.userID]);

    return (
        <>
            {postService && 
            <PostServicePopUp 
                setPostService={setPostService} setUserPosts={setUserPosts} 
                cursor={cursor} setReachedBottom={setReachedBottom} setNextPage={setNextPage}
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
                {errorMessage !== "" && <h1 className="text-3xl">{errorMessage}</h1>}
                <div className="flex flex-col gap-7 items-center pb-11">
                    <div className="flex items-center gap-[30px] flex-wrap pb-11 w-full">
                        {userPosts.map((post: IPost) => {
                            return (
                                <Post 
                                    createdAt={new Date(post.createdAt)} 
                                    startingPrice={post.startingPrice} title={post.title}
                                    sellerName={userContext.userData.username}
                                    key={post.postID} profilePicURL={userContext.userData.profilePicURL}
                                />
                            );
                        })}
                        {loading && new Array(10).fill(<PostLoading />)}
                    </div>
                </div>
            </div>
        </>
    )
}

export default MyPostsPage;