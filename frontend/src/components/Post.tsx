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
import { sellerLevelTextStyles } from '../utils/sellerLevelTextStyles';

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
    const [saved, setSaved] = useState<boolean>(false);

    const navigate = useNavigate();

    async function savePost(): Promise<void> {
        try {
            if (errorMessage !== "" || successMessage !== "") {
                return;
            }
            
            setSaved(true);
            await axios.post<{ message: string }>(`/api/users/${username}/saved/${postInfo.postID}`);
            actionSuccessful(setSuccessMessage, "Saved post", "");
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            actionSuccessful(setErrorMessage, errorMessage, "");
        }
        finally {
            setSaved(false);
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
        <div className="bg-transparent w-[270px] relative">
            <p className={`absolute rounded-t-[12px] z-10 px-7 py-[11px] w-[100%] transition-all ease-out duration-100 text-center select-none 
            ${errorMessage !== "" ? 'bg-error-text text-main-white' : successMessage ? 'action-btn hover:!bg-[#36BF54]' : '!py-[0px]'}`}>
                {errorMessage !== "" ? errorMessage : successMessage !== "" ? successMessage : ""}
            </p>
            {(!canRemove || !canRemove.unsave) && 
            <svg 
                viewBox="0 0 32 32" 
                xmlns="http://www.w3.org/2000/svg" 
                onClick={savePost}
                className="block fill-[#00000086] w-[24px] h-[24px] stroke-white stroke-2 overflow-visible right-3 top-3 
                absolute cursor-pointer transition-all linear duration-100"
                style={saved ? { scale: '0.90' } : {}}
                aria-hidden="true" 
                role="presentation" 
                focusable="false">
                <path d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z">
                </path>
            </svg>}
            <div className="bg-very-light-gray rounded-[12px] overflow-hidden border border-very-light-gray">
                <img 
                    src={postInfo.images[0].url} 
                    className="w-full h-[255px] object-cover z-0" 
                    alt=""
                    loading="lazy"
                />
            </div>
            <div className="mt-3">
                <div className="flex items-center mb-2 gap-3 relative">
                    <ProfilePicAndStatus 
                        profilePicURL={postInfo.postedBy.user.profilePicURL} 
                        profileStatus={postInfo.postedBy.user.status}
                        statusStyles="before:left-[30px] cursor-pointer"
                    />
                    <div className="flex-grow">
                        <div className="flex justify-between">
                            <p className="whitespace-nowrap text-ellipsis overflow-hidden max-w-[170px]">{postInfo.postedBy.user.username}</p>
                            <div className="flex items-center justify-end gap-[7px]">
                                <img src={StarIcon} className="w-[15px] h-[15px] mb-[2px]" alt="star" />
                                <p className="text-[15px]">{postInfo.postedBy.rating}</p>
                            </div>
                        </div>
                        <p className="text-side-text-gray text-[15px]">
                            ({postInfo.numReviews} reviews)
                        </p>
                    </div>
                </div>
                <p className="text-side-text-gray text-[15px]">{getTimePosted(postInfo.createdAt)}</p>
                <div className="flex items-center mb-2 mt-[2px]">
                    <p className="text-[14px] seller-level" style={sellerLevelTextStyles[postInfo.postedBy.sellerLevel.name]}>
                        {postInfo.postedBy.sellerLevel.name}
                    </p>
                    {seconds < 60 * 60 * 24 && 
                    <p className="bg-[#e6ebff] text-[#4E73F8] text-[14px] px-3 ml-[10px] rounded-[6px]">
                        New
                    </p>}
                </div>
                <div className="pb-2 border-b border-b-very-light-gray h-[60px]">
                    <p className="text-[16px] nav-item leading-6 overflow-hidden text-ellipsis line-clamp-2" onClick={openPostView}>
                        {postInfo.title}
                    </p>
                </div>
                <p className="mt-3">
                    Starting at:
                    <span className="text-main-blue">
                        {` £${postInfo.startingPrice}`}
                    </span>
                </p>
                {canRemove &&
                <Button
                    action={removePost}
                    completedText={canRemove.unsave ? "Unsaved" : "Removed"}
                    defaultText={canRemove.unsave ? "Unsave" : "Remove"}
                    loadingText={canRemove.unsave ? "Unsaving" : "Removing"}
                    styles="red-btn mt-3 h-[33px] w-full rounded-[6px] px-4"
                    textStyles="text-error-text text-[15px]"
                    setErrorMessage={setErrorMessage}
                    redLoadingIcon={true}
                />}
            </div>
        </div>
    );
}

export default Post;