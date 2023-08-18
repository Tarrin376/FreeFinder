import { IReview } from "../models/IReview";
import ProfilePicAndStatus from "./ProfilePicAndStatus";
import { parseDate } from "../utils/parseDate";
import { UserContext } from "../providers/UserProvider";
import { useContext, useState } from "react";
import { getAPIErrorMessage } from "../utils/getAPIErrorMessage";
import ErrorPopUp from "./ErrorPopUp";
import { AnimatePresence } from "framer-motion";
import axios, { AxiosError } from "axios";
import Rating from "./Rating";
import AllReviews from "./AllReviews";
import Actions from "./Actions";

interface ReviewProps {
    reviewInfo: IReview,
    hideActions?: boolean
}

function Review({ reviewInfo, hideActions }: ReviewProps) {
    const userContext = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [helpfulCount, setHelpfulCount] = useState<number>(reviewInfo._count.foundHelpful);
    const [toggled, setToggled] = useState<boolean>(false);
    const [allReviewsPopUp, setAllReviewsPopUp] = useState<boolean>(false);

    async function markAsHelpful(): Promise<void> {
        try {
            await axios.post<{ message: string }>(`/api/helpful-reviews/${userContext.userData.username}/${reviewInfo.postID}/${reviewInfo.reviewID}`);
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
            await axios.delete<{ message: string }>(`/api/helpful-reviews/${userContext.userData.username}/${reviewInfo.postID}/${reviewInfo.reviewID}`);
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
                {allReviewsPopUp &&
                <AllReviews
                    url={`/api/sellers/${reviewInfo.sellerID}/reviews?reviewer=${reviewInfo.reviewer.username}&sort=date&include_old=true`}
                    setAllReviewsPopUp={setAllReviewsPopUp}
                    styles="max-w-[590px] !h-[590px]"
                    title={`${reviewInfo.reviewer.username[reviewInfo.reviewer.username.length - 1] === 's' ? 
                    `${reviewInfo.reviewer.username}'` : `${reviewInfo.reviewer.username}'s`} review history`}
                    hideActions={true}
                />}
            </AnimatePresence>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-5 relative">
                    <ProfilePicAndStatus
                        profilePicURL={reviewInfo.reviewer.profilePicURL}
                        profileStatus={reviewInfo.reviewer.status}
                        username={reviewInfo.reviewer.username}
                        size={42}
                        statusRight={true}
                    />
                    <p>{reviewInfo.reviewer.username}</p>
                </div>
                {!hideActions &&
                <Actions size={50}>
                    <p className="whitespace-nowrap link">
                        Flag inappropriate
                    </p>
                    <p className="whitespace-nowrap link" onClick={() => setAllReviewsPopUp(true)}>
                        Show review history
                    </p>
                </Actions>}
            </div>
            <div className="flex items-center gap-2 mb-2">
                <Rating
                    rating={reviewInfo.rating}
                    size={14}
                />
                <p className="text-side-text-gray text-sm">
                    {parseDate(reviewInfo.createdAt)}
                </p>
            </div>
            <p>{reviewInfo.reviewBody}</p>
            {helpfulCount > 0 &&
            <p className="mt-[1rem] text-side-text-gray text-sm">
                {`${helpfulCount} ${helpfulCount === 1 ? "person" : "people"} found this review helpful`}
            </p>}
            <div className="flex items-center gap-4 mt-3">
                <p className="text-side-text-gray text-sm">Did you find this review helpful?</p>
                <div className="flex items-center gap-3">
                    <button className={`side-btn w-fit text-[15px] !h-[29px] ${helpfulCount > reviewInfo._count.foundHelpful ? 
                    "bg-highlight hover:!bg-highlight-hover" : ""}`} 
                    onClick={markAsHelpful}>
                        Yes
                    </button>
                    <button className={`side-btn w-fit text-[15px] !h-[29px] ${helpfulCount === reviewInfo._count.foundHelpful && toggled ?
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