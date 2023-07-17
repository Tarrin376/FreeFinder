import { IReview } from "../models/IReview";
import ProfilePicAndStatus from "./ProfilePicAndStatus";
import ActionsIcon from "../assets/actions.png";
import { parseDate } from "../utils/parseDate";
import { UserContext } from "../providers/UserContext";
import { useContext, useState } from "react";
import { getAPIErrorMessage } from "../utils/getAPIErrorMessage";
import ErrorPopUp from "./ErrorPopUp";
import { AnimatePresence } from "framer-motion";
import axios, { AxiosError } from "axios";

interface ReviewProps {
    reviewInfo: IReview,
    postID: string
}

function Review({ reviewInfo, postID }: ReviewProps) {
    const userContext = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [helpfulCount, setHelpfulCount] = useState<number>(reviewInfo._count.foundHelpful);
    const [toggled, setToggled] = useState<boolean>(false);

    async function markAsHelpful(): Promise<void> {
        try {
            await axios.post<{ message: string }>(`/api/helpful-reviews/${userContext.userData.username}/${postID}/${reviewInfo.reviewID}`);
            setHelpfulCount((cur) => cur === reviewInfo._count.foundHelpful ? cur + 1 : cur);
            setErrorMessage("");
            setToggled(true);
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            setErrorMessage(errorMessage);
        }
    }

    async function markAsUnhelpful(): Promise<void> {
        try {
            await axios.delete<{ message: string }>(`/api/helpful-reviews/${userContext.userData.username}/${postID}/${reviewInfo.reviewID}`);
            setHelpfulCount((cur) => cur > reviewInfo._count.foundHelpful ? cur - 1 : cur);
            setErrorMessage("");
            setToggled(true);
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            setErrorMessage(errorMessage);
        }
    }

    return (
        <div className="w-full">
            <AnimatePresence>
                {errorMessage !== "" &&
                <ErrorPopUp
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                />}
            </AnimatePresence>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-5 relative">
                    <ProfilePicAndStatus
                        profilePicURL={reviewInfo.reviewer.profilePicURL}
                        profileStatus={reviewInfo.reviewer.status}
                        statusStyles="before:hidden"
                        username={reviewInfo.reviewer.username}
                        size={41}
                    />
                    <p>{reviewInfo.reviewer.username}</p>
                </div>
                <div className="w-[50px] h-[50px] rounded-full hover:bg-hover-light-gray flex items-center justify-center cursor-pointer">
                    <img src={ActionsIcon} className="w-[27px] h-[27px]" alt="" />
                </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
                <img src={ActionsIcon} className="w-[24px] h-[24px]" alt="" />
                <p className="text-side-text-gray text-sm">{parseDate(reviewInfo.createdAt)}</p>
            </div>
            <p>{reviewInfo.reviewBody}</p>
            {helpfulCount > 0 &&
            <p className="mt-[1rem] text-side-text-gray text-sm">
                {`${helpfulCount} ${helpfulCount === 1 ? "person" : "people"} found this review helpful`}
            </p>}
            <div className="flex items-center gap-4 mt-3">
                <p className="text-side-text-gray text-sm">Did you find this review helpful?</p>
                <div className="flex items-center gap-3">
                    <button className={`side-btn w-fit !h-[29px] ${helpfulCount > reviewInfo._count.foundHelpful ? 
                    "bg-highlight hover:!bg-highlight-hover" : ""}`} 
                    onClick={markAsHelpful}>
                        Yes
                    </button>
                    <button className={`side-btn w-fit !h-[29px] ${helpfulCount === reviewInfo._count.foundHelpful && toggled ?
                    "bg-highlight hover:!bg-highlight-hover" : ""}`} 
                    onClick={markAsUnhelpful}>
                        No
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Review;