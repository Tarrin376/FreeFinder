import { useRef, useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import { useFetchPosts } from '../../hooks/useFetchPosts';
import Posts from '../../components/Posts';

function SavedServicesView() {
    const userContext = useContext(UserContext);
    const sortByDropdownRef = useRef<HTMLSelectElement>(null);
    const pageRef = useRef<HTMLDivElement>(null);

    const cursor = useRef<string>("HEAD");
    const [nextPage, setNextPage] = useState<boolean>(false);
    const posts = useFetchPosts(pageRef, userContext.userData.userID, userContext.userData.username, "/sellers/posts", nextPage, setNextPage, cursor);

    return (
        <div className="page">
            <h1 className="text-3xl mb-11">My Posts</h1>
            <div className="flex justify-between w-full items-center mb-11">
                <div className="flex gap-5 w-[35rem] items-stretch">
                    <input type="text" placeholder="Search for post" className="search-bar flex-grow" />
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
            <Posts posts={posts.posts} loading={posts.loading} userID={userContext.userData.userID} />
        </div>
    )
}

export default SavedServicesView;