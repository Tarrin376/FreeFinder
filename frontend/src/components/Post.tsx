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
import { UserContext } from '../providers/UserProvider';
import { motion } from 'framer-motion';
import { limit } from '../hooks/usePaginateData';
import Save from './Save';
import StarSvg from './StarSvg';
import { CanRemovePost } from '../types/CanRemovePost';
import { useUserStatus } from 'src/hooks/useUserStatus';

interface PostProps {
    postInfo: IPost,
    index: number,
    canRemove?: CanRemovePost,
    count?: React.MutableRefObject<number>,
    styles?: string
}

function Post({ postInfo, index, canRemove, count, styles }: PostProps) {
    const [hide, setHide] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const seconds = getSeconds(postInfo.createdAt);
    const userContext = useContext(UserContext);
    const status = useUserStatus(postInfo.postedBy.user.username, postInfo.postedBy.user.status);

    const navigate = useNavigate();

    async function savePost(saved: boolean): Promise<void> {
        try {
            if (errorMessage !== "") {
                return;
            }

            if (saved) {
                await axios.delete<{ message: string }>(`/api/users/${userContext.userData.username}/saved/posts/${postInfo.postID}`);
            } else {
                await axios.post<{ message: string }>(`/api/users/${userContext.userData.username}/saved/posts/${postInfo.postID}`);
            }
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
        <motion.div className={`bg-transparent relative ${styles}`} 
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
                hoverText="post"
                styles="right-3 top-3 absolute z-10"
                isSaved={canRemove?.unsave}
            />}
            <Carousel
                images={postInfo.images}
                btnSize={35}
                wrapperStyles="bg-very-light-gray border border-light-border-gray rounded-[12px] w-full pb-[75%]"
                imageStyles="object-cover w-full h-full"
            />
            <div className="mt-3">
                <div className="flex items-center mb-2 gap-3 relative">
                    <ProfilePicAndStatus 
                        profilePicURL={postInfo.postedBy.user.profilePicURL} 
                        profileStatus={status}
                        action={navigateToProfile}
                        username={postInfo.postedBy.user.username}
                        size={48}
                        statusRight={true}
                    />
                    <div className="flex-grow overflow-hidden">
                        <div className="flex justify-between gap-3">
                            <p className="whitespace-nowrap text-ellipsis overflow-hidden hover:text-main-blue cursor-pointer" 
                            onClick={navigateToProfile}>
                                {postInfo.postedBy.user.username}
                            </p>
                            <div className="flex items-center justify-end gap-[5px]">
                                <StarSvg 
                                    size={15} 
                                    styles="mb-[2px]" 
                                    backgroundColour="#18193F" 
                                />
                                <p className="text-[15px]">{postInfo.rating ? postInfo.rating.toFixed(1) : 0}</p>
                            </div>
                        </div>
                        <p className="text-side-text-gray text-[15px]">
                            {`(${postInfo._count.reviews} ${postInfo._count.reviews === 1 ? "review" : "reviews"})`}
                        </p>
                    </div>
                </div>
                <p className="text-side-text-gray text-[15px]">{getTimePosted(postInfo.createdAt)}</p>
                <div className="mt-[4px] mb-[10px]">
                    <span className="text-[14px] seller-level mr-2 inline-block" style={sellerLevelTextStyles[postInfo.postedBy.sellerLevel.name]}>
                        {postInfo.postedBy.sellerLevel.name}
                    </span>
                    {seconds < 60 * 60 * 24 && 
                    <span className="bg-[#e6ebff] text-[#4E73F8] inline-block text-[14px] px-3 rounded-[6px]">
                        New
                    </span>}
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