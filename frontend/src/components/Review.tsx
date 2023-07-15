import { IReview } from "../models/IReview";
import ProfilePicAndStatus from "./ProfilePicAndStatus";
import ActionsIcon from "../assets/actions.png";

interface ReviewProps {
    reviewInfo: IReview
}

function Review({ reviewInfo }: ReviewProps) {
    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-5 relative">
                    <ProfilePicAndStatus
                        profilePicURL={reviewInfo.reviewer.profilePicURL}
                        profileStatus={reviewInfo.reviewer.status}
                        statusStyles="before:hidden"
                        username={reviewInfo.reviewer.username}
                        size={48}
                    />
                    <p>{reviewInfo.reviewer.username}</p>
                </div>
                <div className="w-[50px] h-[50px] rounded-full hover:bg-hover-light-gray flex items-center justify-center cursor-pointer">
                    <img src={ActionsIcon} className="w-[27px] h-[27px]" alt="" />
                </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
                <img src={ActionsIcon} className="w-[24px] h-[24px]" alt="" />
                <p className="text-side-text-gray text-sm">{new Date(reviewInfo.createdAt).toDateString()}</p>
            </div>
            <p>{reviewInfo.reviewBody}</p>
            <p className="mt-[1rem] mb-3 text-side-text-gray text-sm">
                2,022 people found this review helpful
            </p>
            <div className="flex items-center gap-4">
                <p className="text-side-text-gray text-sm">Did you find this review helpful?</p>
                <div className="flex items-center gap-3">
                    <button className="side-btn w-fit !h-[29px]">Yes</button>
                    <button className="side-btn w-fit !h-[29px]">No</button>
                </div>
            </div>
        </div>
    )
}

export default Review;