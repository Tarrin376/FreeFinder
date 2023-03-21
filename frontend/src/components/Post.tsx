import NotSavedIcon from '../assets/not-saved.png';
import SavedIcon from '../assets/saved.png';
import StarIcon from '../assets/star.png';
import { useState } from 'react';
import { IPost } from '../models/IPost';
import ProfilePicAndStatus from './ProfilePicAndStatus';
import { useNavigate } from 'react-router-dom';
import { actionSuccessful } from '../utils/actionSuccessful';

interface PostProps {
    postInfo: IPost,
    userID: string
}

function Post({ postInfo, userID }: PostProps) {
    const seconds = getSeconds();
    const navigate = useNavigate();
    const [saveErrorMessage, setSaveErrorMessage] = useState<string>("");
    const [saveSuccessMessage, setSaveSuccessMessage] = useState<string>("");

    function getTimePosted(): string {
        if (seconds < 60) {
            return `Posted ${seconds} ${seconds !== 1 ? 'seconds' : 'second'} ago`;
        } else if (seconds < 60 * 60) {
            const minutes = Math.floor(seconds / 60);
            return `Posted ${minutes} ${minutes !== 1 ? 'minutes' : 'minute'} ago`;
        } else if (seconds < 60 * 60 * 24) {
            const hours = Math.floor(seconds / 60 / 60);
            return `Posted ${hours} ${hours !== 1 ? 'hours' : 'hour'} ago`;
        } else {
            const days = Math.floor(seconds / 60 / 60 / 24);
            return `Posted ${days} ${days !== 1 ? 'days' : 'day'} ago`;
        }
    }

    function getSeconds(): number {
        const createdAtDate: Date = new Date(postInfo.createdAt);
        return Math.floor((new Date().getTime() - createdAtDate.getTime()) / 1000);
    }

    function redirectToPost(): void {
        navigate(`/posts/${postInfo.postID}`);
    }

    async function savePost(): Promise<void> {
        try {
            const response = await fetch('/post/savePost', {
                method: 'POST',
                body: JSON.stringify({
                    userID: userID,
                    postID: postInfo.postID
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                } 
            });

            if (response.status !== 500) {
                const data = await response.json();
                if (data.message === "success") {
                    
                } else {
                    
                }
            } else {

            }
        }
        catch (err) {

        }
    }

    return (
        <div className="bg-main-white w-[290px] rounded-[8px] border border-light-gray shadow-post">
            <div className="w-full h-[200px] bg-black rounded-t-[8px]"></div>
            <div className="p-4">
                <div className="flex items-center mt-1 mb-2 gap-3 relative">
                    <ProfilePicAndStatus 
                        profilePicURL={postInfo.postedBy.user.profilePicURL} 
                        profileStatus={postInfo.postedBy.user.status}
                        statusStyles='before:left-[30px]'
                    />
                    <div>
                        <p className="font-semibold">
                            {postInfo.postedBy.user.username} 
                            {seconds < 60 * 60 * 24 && 
                            <span className={`btn-primary action-btn rounded-[12px] px-[9px] text-[14px] ml-[10px] 
                            select-none cursor-pointer hover:!bg-main-purple relative hover:after:content-["<24hrs"] 
                            hover:after:absolute hover:after:bg-main-black hover:after:text-main-white hover:after:px-[9px] hover:after:rounded-[12px]
                            hover:after:bottom-[0px] hover:after:text-[14px] hover:after:left-[55px]`}>
                                New
                            </span>}
                        </p>
                        <div className="flex items-center gap-[7px]">
                            <img src={StarIcon} className="w-[17px] h-[17px]" alt="star" />
                            <p className="text-[15px] text-rating-text font-bold">{postInfo.postedBy.rating}</p>
                            <p className="text-side-text-gray text-[15px]">({postInfo.postedBy.numReviews} reviews)</p>
                        </div>
                    </div>
                </div>
                <p className="text-side-text-gray text-[15px] mb-1">{getTimePosted()}</p>
                <h3 className="text-[18px] font-semibold nav-item pb-3 border-b 
                border-b-light-gray leading-6 h-[60px] break-words" onClick={redirectToPost}>{postInfo.title}</h3>
                <div className="mt-4 flex items-center justify-between relative">
                    <p className="py-[2px] px-3 border border-nav-search-gray rounded-[17px] w-fit">Starting at: £{postInfo.startingPrice}</p>
                    <img src={NotSavedIcon} className="w-[25px] h-[25px] cursor-pointer" alt="save" onClick={savePost} />
                </div>
            </div>
        </div>
    );
}

export default Post;