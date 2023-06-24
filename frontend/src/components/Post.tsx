import StarIcon from '../assets/star.png';
import { useState } from 'react';
import { IPost } from '../models/IPost';
import ProfilePicAndStatus from './ProfilePicAndStatus';
import { Link } from 'react-router-dom';
import { getTimePosted, getSeconds } from '../utils/getTimePosted';
import { actionSuccessful } from '../utils/actionSuccessful';
import Placeholder from '../assets/placeholder_img.jpeg';

interface PostProps {
    postInfo: IPost,
    userID: string,
    canRemove?: {
        deletingPost: boolean,
        setDeletingPost: React.Dispatch<React.SetStateAction<boolean>>,
    }
}

function Post({ postInfo, userID, canRemove }: PostProps) {
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const seconds = getSeconds(postInfo.createdAt);
    const [hide, setHide] = useState<boolean>(false);

    async function savePost(): Promise<void> {
        try {
            if (errorMessage !== "" || successMessage !== "") {
                return;
            }

            const response = await fetch("/api/saved-posts/save", {
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

            const result = await response.json();
            if (result.message === "success") {
                setSuccessMessage("Saved post")
                setHide(true);
            } else {
                actionSuccessful(setErrorMessage, result.message, "");
            }
        }
        catch (err: any) {
            actionSuccessful(setErrorMessage, err.message, "");
        }
    }

    async function removePost(): Promise<void> {
        if (!canRemove || canRemove.deletingPost) {
            return;
        }
    
        try {
            canRemove.setDeletingPost(true);
            const response = await fetch("/api/posts/delete", {
                method: "DELETE",
                body: JSON.stringify({
                    postID: postInfo.postID
                }),
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            });

            const removed = await response.json();
            if (removed.message === "success") {
                setHide(true);
            } else {
                actionSuccessful(setErrorMessage, removed.message, "");
            }
        }
        catch (err: any) {
            actionSuccessful(setErrorMessage, err.message, "");
        }
        finally {
            canRemove.setDeletingPost(false);
        }
    }

    if (hide) {
        return <></>
    }

    return (
        <div className="bg-main-white w-[295px] rounded-[8px] relative overflow-hidden shadow-post">
            <p className={`absolute z-10 px-7 py-[11px] w-[100%] transition ease-out duration-100 text-center ${errorMessage !== "" ? 
            'bg-error-text text-main-white' : successMessage ? 'action-btn hover:!bg-[#36BF54] select-none' : 'select-none'}`}>
                {errorMessage !== "" ? errorMessage : successMessage !== "" ? successMessage : ""}
            </p>
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" onClick={savePost}
            className="block fill-[#00000077] h-[24px] w-[24px] stroke-white stroke-2 overflow-visible right-3 top-3 absolute cursor-pointer" 
            aria-hidden="true" role="presentation" focusable="false">
                <path d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z">
                </path>
            </svg>
            <img src={Placeholder} className="w-full h-[215px] bg-black rounded-t-[8px] object-cover" alt="placeholder" />
            <div className="py-3 px-3">
                <div className="flex items-center mb-2 gap-3 relative">
                    <ProfilePicAndStatus 
                        profilePicURL={postInfo.postedBy.user.profilePicURL} 
                        profileStatus={postInfo.postedBy.user.status}
                        statusStyles='before:left-[30px] cursor-pointer'
                    />
                    <div className="flex-grow">
                        <div className="flex justify-between">
                            <p>
                                <span className="nav-item">{postInfo.postedBy.user.username}</span>
                                {seconds < 60 * 60 * 24 && 
                                <span className="bg-[#ec79f0] text-main-white w-fit text-[14px] px-2 ml-3 rounded-[5px]">
                                    New
                                </span>}
                            </p>
                            <div className="flex items-center gap-[7px]">
                                <img src={StarIcon} className="w-[15px] h-[15px] mb-[2px]" alt="star" />
                                <p className="text-[15px]">{postInfo.postedBy.rating}</p>
                            </div>
                        </div>
                        <p className="text-side-text-gray text-[15px]">
                            ({postInfo.numReviews} reviews)
                        </p>
                    </div>
                </div>
                <p className="text-side-text-gray text-[15px] mb-1">{getTimePosted(postInfo.createdAt)}</p>
                <div className="pb-2 border-b border-b-very-light-gray h-[60px]">
                    <p className="text-[17px] nav-item leading-6 overflow-hidden text-ellipsis line-clamp-2 break-all">
                        <Link to={{ pathname: `/${postInfo.postedBy.user.username}/`, search: `?id=${postInfo.postID}` }}>
                            {postInfo.title}
                        </Link>
                    </p>
                </div>
                <div className="mt-3 flex items-center justify-between relative">
                    <p className="underline">
                        Starting at: <span className="font-semibold">£{postInfo.startingPrice}</span>
                    </p>
                    {canRemove &&
                    <button className="bg-error-red text-error-text hover:bg-error-red-hover btn-primary 
                    p-[3px] px-[8px] h-fit cursor-pointer text-[15px]" onClick={() => removePost()}>
                        Remove
                    </button>}
                </div>
            </div>
        </div>
    );
}

export default Post;