import { useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import { IPost } from "../../models/IPost";
import ProfilePicAndStatus from "../../components/ProfilePicAndStatus";
import StarIcon from '../../assets/star.png';
import { getTimePosted } from "../../utils/getTimePosted";

function PostPage() {
    const location = useLocation();
    const [postData, setPostData] = useState<IPost>();
    
    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`/post/getPost/${location.search}`);
                if (response.status !== 500) {
                    const data = await response.json();
                    setPostData(data.post);
                }
            }
            catch (err: any) {
                console.log(err.message);
            }
        })();
    }, [location.search]);

    if (!postData) {
        return <h1>Loading...</h1>
    }

    return (
        <div className="page">
            <h1 className="text-3xl mb-5">{postData.title}</h1>
            <div className="flex gap-3">
                <div className="relative">
                    <ProfilePicAndStatus 
                        profilePicURL={postData.postedBy.user.profilePicURL} 
                        profileStatus={postData.postedBy.user.status}
                        statusStyles='before:left-[30px]'
                    />
                </div>
                <div>
                    <div className="flex items-center gap-[7px]">
                        <p className="font-semibold">{postData.postedBy.user.username}</p>
                        <img src={StarIcon} className="w-[17px] h-[17px]" alt="star" />
                        <p className="text-[15px] text-rating-text font-bold">{postData.postedBy.rating}</p>
                    </div>
                    <p className="text-side-text-gray text-[15px]">{getTimePosted(postData.createdAt)}</p>
                </div>
            </div>
        </div>
    );
}

export default PostPage;