import RightArrowIcon from "../assets/right-arrow.png";
import { IReview } from "../models/IReview";

interface ReviewsProps {
    reviews: IReview[]
}

function Reviews({ reviews }: ReviewsProps) {
    return (
        <div className="mt-10">
            <div className="flex items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                    <h2 className="text-[1.3rem]">Ratings and reviews</h2>
                    <div className="w-[52px] h-[52px] flex items-center justify-center 
                    hover:bg-hover-light-gray rounded-full cursor-pointer">
                        <img src={RightArrowIcon} alt="" className="w-[26px] h-[26px]" />
                    </div>
                </div>
                <p className="text-[15px] text-side-text-gray">Ratings and reviews are verified</p>
            </div>
            <div className="flex gap-7 items-center">
                <div className="w-fit">
                    <p className="text-[3.5rem] text-center">4.3</p>
                    <p className="text-side-text-gray text-sm text-center">5.45M reviews</p>
                </div>
                <div className="flex-grow flex flex-col gap-[1px]">
                    <div className="flex items-center gap-3">
                        <p className="text-sm text-side-text-gray">5</p>
                        <div className="flex-grow rounded-full h-[14px] bg-very-light-gray"></div>
                    </div>
                    <div className="flex items-center gap-3">
                        <p className="text-sm text-side-text-gray">5</p>
                        <div className="flex-grow rounded-full h-[14px] bg-very-light-gray"></div>
                    </div>
                    <div className="flex items-center gap-3">
                        <p className="text-sm text-side-text-gray">5</p>
                        <div className="flex-grow rounded-full h-[14px] bg-very-light-gray"></div>
                    </div>
                    <div className="flex items-center gap-3">
                        <p className="text-sm text-side-text-gray">5</p>
                        <div className="flex-grow rounded-full h-[14px] bg-very-light-gray"></div>
                    </div>
                    <div className="flex items-center gap-3">
                        <p className="text-sm text-side-text-gray">5</p>
                        <div className="flex-grow rounded-full h-[14px] bg-very-light-gray"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reviews;