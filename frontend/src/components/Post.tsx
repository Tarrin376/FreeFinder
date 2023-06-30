import StarIcon from '../assets/star.png';
import { useState } from 'react';
import { IPost } from '../models/IPost';
import ProfilePicAndStatus from './ProfilePicAndStatus';
import { getTimePosted, getSeconds } from '../utils/getTimePosted';
import { actionSuccessful } from '../utils/actionSuccessful';
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from '../utils/getAPIErrorMessage';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

interface PostProps {
    postInfo: IPost,
    username: string,
    canRemove?: {
        deletingPost: boolean,
        setDeletingPost: React.Dispatch<React.SetStateAction<boolean>>,
        removeURL: string,
        unsave?: boolean
    }
}

function Post({ postInfo, username, canRemove }: PostProps) {
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const seconds = getSeconds(postInfo.createdAt);
    const [hide, setHide] = useState<boolean>(false);
    const navigate = useNavigate();

    async function savePost(): Promise<void> {
        try {
            if (errorMessage !== "" || successMessage !== "") {
                return;
            }

            await axios.post<{ message: string }>(`/api/users/${username}/saved-posts/${postInfo.postID}`);
            actionSuccessful(setSuccessMessage, "Saved post", "");
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            actionSuccessful(setErrorMessage, errorMessage, "");
        }
    }

    async function removePost(): Promise<string | undefined> {
        if (!canRemove || canRemove.deletingPost) {
            return;
        }

        try {
            canRemove.setDeletingPost(true);
            await axios.delete<{ message: string }>(`${canRemove.removeURL}/${postInfo.postID}`);
            canRemove.setDeletingPost(false);
            setHide(true);
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            canRemove.setDeletingPost(false);
            return errorMessage;
        }
    }

    const openPostView = () => {
        navigate(`/posts/${postInfo.postID}`);
    }

    if (hide) {
        return <></>
    }

    return (
        <div className="bg-transparent w-[270px] rounded-[8px] relative overflow-hidden">
            <p className={`absolute z-10 px-7 py-[11px] w-[100%] transition-all ease-out duration-100 text-center select-none  ${errorMessage !== "" ? 
            'bg-error-text text-main-white' : successMessage ? 'action-btn hover:!bg-[#36BF54]' : '!py-[0px]'}`}>
                {errorMessage !== "" ? errorMessage : successMessage !== "" ? successMessage : ""}
            </p>
            {(!canRemove || !canRemove.unsave) && 
            <svg 
                viewBox="0 0 32 32" 
                xmlns="http://www.w3.org/2000/svg" 
                onClick={savePost}
                className="block fill-[#00000086] h-[24px] w-[24px] stroke-white stroke-2 overflow-visible right-3 top-3 absolute cursor-pointer" 
                aria-hidden="true" 
                role="presentation" 
                focusable="false">
                <path d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z">
                </path>
            </svg>}
            <img src={postInfo.images[0].url} className="w-full h-[255px] rounded-[8px] border border-light-border-gray object-cover" alt="placeholder" />
            <div className="mt-3">
                <div className="flex items-center mb-2 gap-3 relative">
                    <ProfilePicAndStatus 
                        profilePicURL={postInfo.postedBy.user.profilePicURL} 
                        profileStatus={postInfo.postedBy.user.status}
                        statusStyles='before:left-[30px] cursor-pointer'
                    />
                    <div className="flex-grow">
                        <div className="flex justify-between">
                            <p>{postInfo.postedBy.user.username}</p>
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
                <p className="text-side-text-gray text-[14px] mb-1">
                    {getTimePosted(postInfo.createdAt)}
                    {seconds < 60 * 60 * 24 && 
                    <span className="bg-[#ec79f0] text-main-white w-fit text-[14px] px-3 py-[1px] ml-3 rounded-[6px]">
                        New
                    </span>}
                </p>
                <div className="pb-2 border-b border-b-very-light-gray h-[60px]">
                    <p className="text-[16px] nav-item leading-6 overflow-hidden text-ellipsis line-clamp-2 break-all"
                    onClick={openPostView}>
                        {postInfo.title}
                    </p>
                </div>
                <div className="mt-3 flex items-center justify-between relative">
                    <p>Starting at: <span className="text-main-blue">£{postInfo.startingPrice}</span></p>
                    {canRemove &&
                    <Button
                        action={removePost}
                        completedText={canRemove.unsave ? "Unsaved" : "Removed"}
                        defaultText={canRemove.unsave ? "Unsave" : "Remove"}
                        loadingText={canRemove.unsave ? "Unsaving" : "Removing"}
                        styles="red-btn h-[33px] rounded-[6px]"
                        textColor="text-error-text"
                        hideLoadingIcon={true}
                        setErrorMessage={setErrorMessage}
                    />}
                </div>
            </div>
        </div>
    );
}

export default Post;