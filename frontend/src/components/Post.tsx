import NotSavedIcon from '../assets/not-saved.png';
import SavedIcon from '../assets/saved.png';
import StarIcon from '../assets/star.png';
import { useState } from 'react';
import { IListing } from '../models/IListing';
import ProfilePicAndStatus from './ProfilePicAndStatus';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getTimePosted, getSeconds } from '../utils/getTimePosted';
import { actionSuccessful } from '../utils/actionSuccessful';

interface PostProps {
    postInfo: IListing,
    userID: string
}

function Post({ postInfo, userID }: PostProps) {
    const navigate = useNavigate();
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
                    actionSuccessful(setSaveSuccessMessage, "Successfully saved image to your list of saved services.", "");
                } else {
                    actionSuccessful(setSaveErrorMessage, `Unable to save image: ${data.message}.`, "");
                }
            } else {
                actionSuccessful(setSaveErrorMessage, "Something unexpected occured on our end.", "");
            }
        }
        catch (err: any) {
            actionSuccessful(setSaveErrorMessage, `Unable to save image: ${err.message}.`, "");
        }
    }

    return (
        <div className="bg-main-white w-[290px] rounded-[8px] border border-light-gray shadow-post relative overflow-hidden">
            <p className={`absolute px-4 py-2 w-[100%] font-semibold transition ease-out duration-100
            ${saveErrorMessage !== "" ? 'bg-error-red text-main-white' : saveSuccessMessage ? 'action-btn' : ''}`}>
                {saveErrorMessage !== "" ? saveErrorMessage : saveSuccessMessage !== "" ? saveSuccessMessage : ""}
            </p>
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
                            <span className="btn-primary action-btn rounded-[12px] px-[9px] text-[14px] ml-[10px] 
                            select-none cursor-pointer">
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
                <p className="text-side-text-gray text-[15px] mb-1">{getTimePosted(postInfo.createdAt)}</p>
                <div className="pb-3 border-b border-b-light-gray">
                    <p className="text-[18px] font-semibold nav-item leading-6 whitespace-nowrap overflow-hidden text-ellipsis">
                        <Link to={{ pathname: `/${postInfo.postedBy.user.username}/`, search: `?id=${postInfo.postID}` }}>
                            {postInfo.title}
                        </Link>
                    </p>
                </div>
                <div className="mt-4 flex items-center justify-between relative">
                    <p className="py-[2px] px-3 border border-nav-search-gray rounded-[17px] w-fit">Starting at: £{postInfo.startingPrice}</p>
                    <img src={NotSavedIcon} className="w-[25px] h-[25px] cursor-pointer" alt="save" onClick={savePost} />
                </div>
            </div>
        </div>
    );
}

export default Post;