import StarIcon from '../assets/star.png';
import { useState, useContext } from 'react';
import { IPost } from '../models/IPost';
import ProfilePicAndStatus from './ProfilePicAndStatus';
import { getTimePosted, getSeconds } from '../utils/getTimePosted';
import { actionFinished } from '../utils/actionFinished';
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from '../utils/getAPIErrorMessage';
import Button from './Button';
import { useNavigate } from 'react-router-dom';
import { sellerLevelTextStyles } from '../utils/sellerLevelTextStyles';
import Carousel from './Carousel';
import { UserContext } from '../providers/UserContext';

interface PostProps {
    postInfo: IPost,
    canRemove?: {
        deletingPost: boolean,
        setDeletingPost: React.Dispatch<React.SetStateAction<boolean>>,
        removeURL: string,
        unsave?: boolean
    },
    styles?: string
}

function Post({ postInfo, canRemove, styles }: PostProps) {
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const seconds = getSeconds(postInfo.createdAt);
    const [hide, setHide] = useState<boolean>(false);
    const [saved, setSaved] = useState<boolean>(false);
    const userContext = useContext(UserContext);

    const navigate = useNavigate();

    async function savePost(): Promise<void> {
        try {
            if (errorMessage !== "" || successMessage !== "") {
                return;
            }
            
            setSaved(true);
            await axios.post<{ message: string }>(`/api/users/${userContext.userData.username}/saved/posts/${postInfo.postID}`);
            actionFinished(setSuccessMessage, "Saved post", "");
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            actionFinished(setErrorMessage, errorMessage, "");
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
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            canRemove.setDeletingPost(false);
            return errorMessage;
        }
    }

    function openPostView() {
        navigate(`/posts/${postInfo.postID}`);
    }

    function navigateToProfile() {
        navigate(`/sellers/${postInfo.postedBy.user.username}`);
    }

    if (hide) {
        return <></>
    }

    return (
        <div className={`bg-transparent w-[320px] relative ${styles}`}>
            <p className={`absolute rounded-t-[12px] z-20 px-7 py-[11px] w-[100%] 
            transition-all whitespace-normal ease-out duration-100 text-center 
            ${errorMessage !== "" ? 'bg-error-text text-main-white' 
            : successMessage ? 'action-btn hover:!bg-[#36BF54]' : '!py-[0px]'}`}>
                {errorMessage !== "" ? errorMessage : successMessage !== "" ? successMessage : ""}
            </p>
            {(!canRemove || !canRemove.unsave) && 
            <svg 
                viewBox="0 0 32 32" 
                xmlns="http://www.w3.org/2000/svg" 
                onClick={savePost}
                className="block fill-[#00000086] w-[24px] h-[24px] stroke-white stroke-2 overflow-visible right-3 top-3 
                absolute cursor-pointer transition-all linear duration-100 z-10"
                style={saved ? { scale: '0.90' } : {}}
                aria-hidden="true" 
                role="presentation" 
                focusable="false">
                <path d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z">
                </path>
            </svg>}
            <Carousel
                images={postInfo.images}
                btnSize={35}
                wrapperStyles="bg-very-light-gray rounded-[12px] border border-very-light-gray h-[235px]"
                imageStyles="object-cover w-full"
            />
            <div className="mt-3">
                <div className="flex items-center mb-2 gap-3 relative">
                    <ProfilePicAndStatus 
                        profilePicURL={postInfo.postedBy.user.profilePicURL} 
                        profileStatus={postInfo.postedBy.user.status}
                        statusStyles="before:left-[30px] cursor-pointer"
                        action={navigateToProfile}
                    />
                    <div className="flex-grow">
                        <div className="flex justify-between">
                            <p className="whitespace-nowrap text-ellipsis overflow-hidden max-w-[170px] 
                            hover:text-main-blue cursor-pointer" onClick={navigateToProfile}>
                                {postInfo.postedBy.user.username}
                            </p>
                            <div className="flex items-center justify-end gap-[7px]">
                                <img src={StarIcon} className="w-[18px] h-[18px] mb-[2px]" alt="star" />
                                <p className="text-[15px]">{postInfo.postedBy.rating}</p>
                            </div>
                        </div>
                        <p className="text-side-text-gray text-[15px]">
                            ({postInfo._count.reviews} reviews)
                        </p>
                    </div>
                </div>
                <p className="text-side-text-gray text-[15px]">{getTimePosted(postInfo.createdAt)}</p>
                <div className="flex items-center mb-2 mt-[4px]">
                    <p className="text-[14px] seller-level" style={sellerLevelTextStyles[postInfo.postedBy.sellerLevel.name]}>
                        {postInfo.postedBy.sellerLevel.name}
                    </p>
                    {seconds < 60 * 60 * 24 && 
                    <p className="bg-[#e6ebff] text-[#4E73F8] text-[14px] px-3 ml-[10px] rounded-[6px]">
                        New
                    </p>}
                </div>
                <div className="pb-2 border-b border-b-very-light-gray h-[60px]">
                    <p className="text-[16px] link leading-6 overflow-hidden text-ellipsis line-clamp-2 !p-0" onClick={openPostView}>
                        {postInfo.title}
                    </p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                    <p>
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
                        styles="red-btn h-[33px] w-fit rounded-[6px]"
                        textStyles="text-error-text text-[15px]"
                        setErrorMessage={setErrorMessage}
                        redLoadingIcon={true}
                        whenComplete={() => setHide(true)}
                    />}
                </div>
            </div>
        </div>
    );
}

export default Post;