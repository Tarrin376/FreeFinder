import PostService from '../../components/PostService';
import { useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { IUserContext } from '../../context/UserContext';

function MyPostsPage() {
    const [postService, setPostService] = useState<boolean>(false);
    const userContext: IUserContext = useContext(UserContext);

    function openPostService(): void {
        if (userContext.userData.username === "") {
            setPostService(true);
        } else {
            setPostService(true);
        }
    }

    return (
        <>
            {postService && <PostService setPostService={setPostService} />}
            <div className="page">
                <h1 className="mt-14 text-3xl mb-11">My Posts</h1>
                <div className="flex justify-between w-full items-center">
                    <div className="flex gap-5">
                        <input type="text" placeholder="Search by term or seller" className="search-bar max-w-[27.5rem]" />
                        <button onClick={openPostService} className="text-main-white bg-slate-500 w-60 rounded-[8px]">Create new post</button>
                    </div>
                    <div className="flex items-center gap-4">
                        <p>Sort by</p>
                        <select className="p-2 bg-main-white rounded-[8px] border border-nav-search-gray cursor-pointer">
                            <option>recent</option>
                            <option>Seller rating</option>
                            <option>date posted</option>
                        </select>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MyPostsPage;