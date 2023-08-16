import { useState, useContext } from 'react';
import { IPost } from '../models/IPost';
import ProfilePicAndStatus from './ProfilePicAndStatus';
import { getSeconds } from '../utils/getSeconds';
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
import ErrorPopUp from './ErrorPopUp';
import { AnimatePresence } from 'framer-motion';
import { useTimeCreated } from 'src/hooks/useTimeCreated';
import HideIcon from "../assets/hide.png";
import UnhideIcon from "../assets/unhide.png";
import { SendNotification } from 'src/types/SendNotification';

interface PostProps {
    postInfo: IPost,
    index: number,
    canRemove?: CanRemovePost,
    count?: React.MutableRefObject<number>,
    styles?: string
}

function Post({ postInfo, index, canRemove, count, styles }: PostProps) {
    const [remove, setRemove] = useState<boolean>(false);
    const [hide, setHide] = useState<boolean>(postInfo.hidden);
    const [hidingPost, setHidingPost] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const seconds = getSeconds(postInfo.createdAt);

    const userContext = useContext(UserContext);
    const timeCreated = useTimeCreated(postInfo.createdAt);
    const navigate = useNavigate();

    async function savePost(saved: boolean): Promise<boolean> {
        try {
            if (saved) {
                await axios.delete<{ message: string }>(`/api/users/${userContext.userData.username}/saved/posts/${postInfo.postID}`);
            } else {
                await axios.post<{ message: string }>(`/api/users/${userContext.userData.username}/saved/posts/${postInfo.postID}`);
            }

            return true;
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            setErrorMessage(errorMessage);
            return false;
        }
    }

    function sendNotifications(users: SendNotification[]): void {
        for (const user of users) {
            userContext.socket?.emit("send-notification", user.notification, user.socketID);
        }
    }

    async function removePost(): Promise<string | undefined> {
        if (!canRemove || canRemove.deletingPost || !count) {
            return;
        }
        
        try {
            canRemove.setDeletingPost(true);

            if (!canRemove.unsave) {
                const resp = await axios.delete<{ usersSaved: SendNotification[], message: string }>(`${canRemove.removeURL}/${postInfo.postID}`);
                sendNotifications(resp.data.usersSaved);
            } else {
                const saved = await savePost(true);
                if (!saved) return;
                else setRemove(true);
            }
            
            count.current -= 1;
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            return errorMessage;
        }
        finally {
            canRemove.setDeletingPost(false);
        }
    }

    async function toggleHidePost(): Promise<void> {
        if (hidingPost) {
            return;
        }

        try {
            setHidingPost(true);
            const resp = await axios.put<{ usersSaved: SendNotification[], message: string }>
            (`/api/posts/${postInfo.postID}`, { 
                hidden: !hide 
            });

            sendNotifications(resp.data.usersSaved);
            setHide(!hide);
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            setErrorMessage(errorMessage);
        }
        finally {
            setHidingPost(false);
        }
    }

    function openPostView(): void {
        navigate(`/posts/${postInfo.postID}`);
    }

    function navigateToProfile(): void {
        navigate(`/sellers/${postInfo.postedBy.sellerID}`);
    }

    if (remove) {
        return <></>
    }

    return (
        <motion.div className={`bg-transparent relative ${styles}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} transition={{ delay: 0.05 * (index % limit), duration: 0.2 }}>
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
                wrapperStyles="bg-very-light-gray border border-light-border-gray rounded-[12px] w-full pb-[66.66%]"
                imageStyles="object-cover w-full h-full"
            />
            {canRemove && !canRemove.unsave &&
            <button className="right-3 top-3 absolute z-10 bg-[#000000ab] hover:bg-[#0e0e0eab] 
            btn-primary h-fit rounded-[6px] px-[12px]" onClick={toggleHidePost}>
                <div className="flex items-center gap-2">
                    <span className="text-main-white text-[15px]">{hide ? "Unhide" : "Hide"}</span>
                    <img src={hide ? UnhideIcon : HideIcon} className="w-[17px] h-[17px]" alt="" />
                </div>
            </button>}
            <AnimatePresence>
                {errorMessage !== "" && 
                <ErrorPopUp 
                    errorMessage={errorMessage} 
                    setErrorMessage={setErrorMessage}
                />}
            </AnimatePresence>
            <div className="mt-3">
                <div className="flex items-center mb-2 gap-3 relative">
                    <ProfilePicAndStatus 
                        profilePicURL={postInfo.postedBy.user.profilePicURL} 
                        profileStatus={postInfo.postedBy.user.status}
                        action={navigateToProfile}
                        username={postInfo.postedBy.user.username}
                        size={48}
                        statusRight={true}
                    />
                    <div className="flex-grow overflow-hidden">
                        <div className="flex justify-between gap-3">
                            <p className="whitespace-nowrap text-ellipsis overflow-hidden link cursor-pointer" 
                            onClick={navigateToProfile} title={postInfo.postedBy.user.username}>
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
                <p className="text-side-text-gray text-[15px]">
                    {`Posted ${timeCreated}`}
                </p>
                <div className="mt-[4px] mb-[10px]">
                    <span className="text-[14px] seller-level mr-2 inline-block" style={sellerLevelTextStyles[postInfo.postedBy.sellerLevel.name]}>
                        {postInfo.postedBy.sellerLevel.name}
                    </span>
                    {seconds < 60 * 60 * 24 && 
                    <span className="bg-[#e6ebff] text-[#4169f7] inline-block text-[14px] px-3 rounded-[6px]">
                        New
                    </span>}
                </div>
                <div className="pb-2 border-b border-b-light-border-gray h-[60px]">
                    <p className="text-[16px] link leading-6 overflow-hidden text-ellipsis line-clamp-2 !p-0" 
                    onClick={openPostView} title={postInfo.title}>
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
                        styles={`red-btn h-[30px] w-fit rounded-[6px] ${canRemove && canRemove.deletingPost ? "pointer-events-none" : ""}`}
                        textStyles="text-error-text text-[15px]"
                        setErrorMessage={setErrorMessage}
                        whenComplete={() => setRemove(true)}
                        loadingSvgSize={24}
                        loadingSvgColour="#F43C3C"
                    />}
                </div>
            </div>
        </motion.div>
    )
}

export default Post;