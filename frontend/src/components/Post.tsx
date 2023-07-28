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
import { motion } from 'framer-motion';
import { limit } from '../hooks/usePaginateData';
import Save from './Save';
import StarSvg from './StarSvg';

type CanRemovePost = {
    deletingPost: boolean,
    setDeletingPost: React.Dispatch<React.SetStateAction<boolean>>,
    removeURL: string,
    unsave?: boolean
}

interface PostProps {
    postInfo: IPost,
    index: number,
    canRemove?: CanRemovePost
    count?: React.MutableRefObject<number>,
    styles?: string
}

function Post({ postInfo, index, canRemove, count, styles }: PostProps) {
    const [hide, setHide] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const seconds = getSeconds(postInfo.createdAt);
    const userContext = useContext(UserContext);

    const navigate = useNavigate();

    async function savePost(checked: boolean): Promise<void> {
        try {
            let response = null;
            if (errorMessage !== "") {
                return;
            }

            if (checked) {
                response = await axios.delete<{ savedPosts: string[], message: string }>
                (`/api/users/${userContext.userData.username}/saved/posts/${postInfo.postID}`);
            } else {
                response = await axios.post<{ savedPosts: string[], message: string }>
                (`/api/users/${userContext.userData.username}/saved/posts/${postInfo.postID}`);
            }

            userContext.setUserData({
                ...userContext.userData,
                savedPosts: new Set(response.data.savedPosts)
            });
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            actionFinished(setErrorMessage, errorMessage, "");
        }
    }

    async function removePost(): Promise<string | undefined> {
        if (!canRemove || canRemove.deletingPost || !count) {
            return;
        }
        
        try {
            canRemove.setDeletingPost(true);
            if (!canRemove.unsave) {
                await axios.delete<{ message: string }>(`${canRemove.removeURL}/${postInfo.postID}`);
            } else {
                await savePost(true);
            }
            
            count.current -= 1;
            canRemove.setDeletingPost(false);
            setHide(true);
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            canRemove.setDeletingPost(false);
            return errorMessage;
        }
    }

    function openPostView(): void {
        navigate(`/posts/${postInfo.postID}`);
    }

    function navigateToProfile(): void {
        navigate(`/sellers/${postInfo.postedBy.sellerID}`);
    }

    if (hide) {
        return <></>
    }

    return (
        <motion.div className={`bg-transparent w-[320px] relative ${styles}`} 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
        transition={{ delay: 0.05 * (index % limit), duration: 0.2 }}>
            <p className={`absolute rounded-t-[12px] z-20 px-7 py-[11px] w-[100%] 
            transition-all whitespace-normal ease-out duration-100 text-center 
            ${errorMessage !== "" ? 'bg-error-text text-main-white' : '!py-[0px]'}`}>
                {errorMessage !== "" ? errorMessage : ""}
            </p>
            {userContext.userData.username !== postInfo.postedBy.user.username &&
            userContext.userData.username !== "" &&
            <Save
                action={canRemove?.unsave ? removePost : savePost}
                svgSize={24}
                checked={userContext.userData.savedPosts.has(postInfo.postID)}
                hoverText={userContext.userData.savedPosts.has(postInfo.postID) ? "Unsave post" : "Save post"}
                styles="right-3 top-3 absolute z-10"
            />}
            <Carousel
                images={postInfo.images}
                btnSize={35}
                wrapperStyles="bg-very-light-gray border border-light-border-gray rounded-[12px] h-[235px]"
                imageStyles="object-cover w-full"
            />
            <div className="mt-3">
                <div className="flex items-center mb-2 gap-3 relative">
                    <ProfilePicAndStatus 
                        profilePicURL={postInfo.postedBy.user.profilePicURL} 
                        profileStatus={postInfo.postedBy.user.status}
                        statusStyles="before:left-[30px] cursor-pointer"
                        action={navigateToProfile}
                        username={postInfo.postedBy.user.username}
                        size={48}
                    />
                    <div className="flex-grow overflow-hidden">
                        <div className="flex justify-between gap-3">
                            <p className="whitespace-nowrap text-ellipsis overflow-hidden hover:text-main-blue cursor-pointer" 
                            onClick={navigateToProfile}>
                                {postInfo.postedBy.user.username}
                            </p>
                            <div className="flex items-center justify-end gap-[5px]">
                                <StarSvg size={15} styles="mb-[2px]" backgroundColour="#292929" />
                                <p className="text-[15px]">{postInfo.rating ? postInfo.rating.toFixed(1) : 0}</p>
                            </div>
                        </div>
                        <p className="text-side-text-gray text-[15px]">
                            {`(${postInfo._count.reviews} ${postInfo._count.reviews === 1 ? "review" : "reviews"})`}
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
                <div className="pb-2 border-b border-b-light-border-gray h-[60px]">
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
                    {canRemove && !canRemove.unsave &&
                    <Button
                        action={removePost}
                        completedText="Removed"
                        defaultText="Remove"
                        loadingText="Removing"
                        styles="red-btn h-[30px] w-fit rounded-[6px]"
                        textStyles="text-error-text text-[15px]"
                        setErrorMessage={setErrorMessage}
                        whenComplete={() => setHide(true)}
                        loadingSvgSize={24}
                        loadingSvgColour="#F43C3C"
                    />}
                </div>
            </div>
        </motion.div>
    )
}

export default Post;