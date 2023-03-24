import StarIcon from '../assets/star.png';
import { useState } from 'react';
import { IPost } from '../models/IPost';
import ProfilePicAndStatus from './ProfilePicAndStatus';
import { Link } from 'react-router-dom';
import { getTimePosted, getSeconds } from '../utils/getTimePosted';
import { actionSuccessful } from '../utils/actionSuccessful';
import TrashIcon from '../assets/trash.png';

interface PostProps {
    postInfo: IPost,
    userID: string,
    isUserPost: boolean
}

function Post({ postInfo, userID, isUserPost }: PostProps) {
    const [saveErrorMessage, setSaveErrorMessage] = useState<string>("");
    const [saveSuccessMessage, setSaveSuccessMessage] = useState<string>("");
    const seconds = getSeconds(postInfo.createdAt);

    async function savePost(): Promise<void> {
        try {
            if (saveErrorMessage !== "" || saveSuccessMessage !== "") {
                return;
            }

            const response = await fetch('/posts/save', {
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
                    actionSuccessful(setSaveSuccessMessage, "Image saved", "");
                } else if (data.message === "Post already added") {
                    actionSuccessful(setSaveSuccessMessage, data.message, "");
                } else {
                    actionSuccessful(setSaveErrorMessage, `Unable to save image: ${data.message}`, "");
                }
            } else {
                actionSuccessful(setSaveErrorMessage, "Something unexpected occured on our end", "");
            }
        }
        catch (err: any) {
            actionSuccessful(setSaveErrorMessage, `Unable to save image: ${err.message}`, "");
        }
    }

    return (
        <div className="bg-transparent w-[290px] rounded-[8px] relative overflow-hidden">
            <p className={`absolute px-4 py-[11px] w-[100%] font-semibold transition ease-out duration-100 text-center
            ${saveErrorMessage !== "" ? 'bg-error-red text-main-white' : saveSuccessMessage ? 'action-btn hover:!bg-[#36BF54] select-none' : 'select-none'}`}>
                {saveErrorMessage !== "" ? saveErrorMessage : saveSuccessMessage !== "" ? saveSuccessMessage : ""}
            </p>
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" onClick={savePost}
            className="block fill-[#00000077] h-[24px] w-[24px] stroke-white stroke-2 overflow-visible right-3 top-3 absolute cursor-pointer" 
            aria-hidden="true" role="presentation" focusable="false">
                <path d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z">
                </path>
            </svg>
            <div className="w-full h-[250px] bg-black rounded-[11px]"></div>
            <div className="py-2">
                <div className="flex items-center mt-1 mb-2 gap-3 relative">
                    <ProfilePicAndStatus 
                        profilePicURL={postInfo.postedBy.user.profilePicURL} 
                        profileStatus={postInfo.postedBy.user.status}
                        statusStyles='before:left-[30px]'
                    />
                    <div>
                        <p>
                            {postInfo.postedBy.user.username} 
                            {seconds < 60 * 60 * 24 && 
                            <span className="btn-primary action-btn rounded-[12px] px-[9px] text-[14px] ml-[10px] 
                            select-none cursor-pointer">
                                New
                            </span>}
                        </p>
                        <div className="flex items-center gap-[7px]">
                            <img src={StarIcon} className="w-[15px] h-[15px] mb-[2px]" alt="star" />
                            <p className="text-[15px] text-main-black">{postInfo.postedBy.rating}</p>
                            <p className="text-side-text-gray text-[15px]">({postInfo.numReviews} reviews)</p>
                        </div>
                    </div>
                </div>
                <p className="text-side-text-gray text-[15px] mb-1">{getTimePosted(postInfo.createdAt)}</p>
                <div className="pb-3 border-b border-b-very-light-gray">
                    <p className="text-[17px] nav-item leading-6 overflow-hidden text-ellipsis line-clamp-2">
                        <Link to={{ pathname: `/${postInfo.postedBy.user.username}/`, search: `?id=${postInfo.postID}` }}>
                            {postInfo.title}
                        </Link>
                    </p>
                </div>
                <div className="mt-2 flex items-center justify-between relative underline">
                    <p className="">Starting at: <span className="font-semibold">£{postInfo.startingPrice}</span></p>
                    {isUserPost && <img src={TrashIcon} className="w-[30px] h-[30px] bg-[#0000000c] rounded-[8px] cursor-pointer" />}
                </div>
            </div>
        </div>
    );
}

export default Post;