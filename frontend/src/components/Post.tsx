import NotSavedIcon from '../assets/not-saved.png';
import SavedIcon from '../assets/saved.png';
import StarIcon from '../assets/star.png';
import { useState } from 'react';
import { IPost } from '../models/IPost';
import ProfilePicAndStatus from './ProfilePicAndStatus';
import { useNavigate } from 'react-router-dom';

function Post({ sellerInfo, userID }: { sellerInfo: IPost, userID: string }) {
    const [saved, setSaved] = useState<boolean>(false);
    const [errorSaving, setErrorSaving] = useState<boolean>(false);
    const seconds = getSeconds();
    const navigate = useNavigate();

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
        const createdAtDate = new Date(sellerInfo.createdAt);
        return Math.floor((new Date().getTime() - createdAtDate.getTime()) / 1000);
    }

    function showSaveMessage(setState: React.Dispatch<React.SetStateAction<boolean>>) {
        setState(true);
        setTimeout(() => {
            setState(false);
        }, 2000);
    }

    function redirectToPost() {
        navigate(`/posts/${sellerInfo.postID}`);
    }

    async function savePost(): Promise<void> {
        try {
            if (saved || errorSaving) {
                return;
            }
            
            const response = await fetch('/post/savePost', {
                method: 'POST',
                body: JSON.stringify({
                    userID: userID,
                    postID: sellerInfo.postID
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                return res.json();
            });

            if (response.message === "success") {
                showSaveMessage(setSaved);
            } else {
                showSaveMessage(setErrorSaving);
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
                        profilePicURL={sellerInfo.postedBy.user.profilePicURL} 
                        profileStatus={sellerInfo.postedBy.user.status}
                        statusStyles='before:left-[30px]'
                    />
                    <div>
                        <p className="font-semibold">
                            {sellerInfo.postedBy.user.username} 
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
                            <p className="text-[15px] text-rating-text font-bold">{sellerInfo.postedBy.rating}</p>
                            <p className="text-side-text-gray text-[15px]">({sellerInfo.postedBy.numReviews} reviews)</p>
                        </div>
                    </div>
                </div>
                <p className="text-side-text-gray text-[15px] mb-1">{getTimePosted()}</p>
                <h3 className="text-[18px] font-semibold nav-item pb-3 border-b 
                border-b-light-gray leading-6 h-[60px] break-words" onClick={redirectToPost}>{sellerInfo.title}</h3>
                <div className="mt-4 flex items-center justify-between relative">
                    <p className="py-[2px] px-3 border border-nav-search-gray rounded-[17px] w-fit">Starting at: £{sellerInfo.startingPrice}</p>
                    <div className={`transition ease-linear duration-100 ${saved ? `before:absolute before:top-[33px] before:right-0 
                    before:content-["saved"] before:text-[15px] before:bg-main-black before:text-main-white before:p-1 before:px-2 before:rounded-[8px]` 
                    : errorSaving ? `before:absolute before:top-[33px] before:right-0 
                    before:content-["removed"] before:text-[15px] before:bg-error-red before:text-main-white before:p-1 before:px-2 before:rounded-[8px]` : ``}`}>
                        <img src={NotSavedIcon} className="w-[25px] h-[25px] cursor-pointer" alt="save" onClick={savePost} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Post;