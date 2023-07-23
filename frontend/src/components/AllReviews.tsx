import PopUpWrapper from "../wrappers/PopUpWrapper";
import { usePaginateData } from "../hooks/usePaginateData";
import { useRef, useState } from "react";
import { IReview } from "../models/IReview";
import { ReviewsResponse } from "../types/ReviewsResponse";
import Review from "./Review";

interface AllReviewsProps {
    url: string,
    setAllReviewsPopUp: React.Dispatch<React.SetStateAction<boolean>>,
    maxWidth: string,
    maxHeight: string,
    title: string,
    hideActions?: boolean
}

function AllReviews({ url, setAllReviewsPopUp, maxWidth, maxHeight, title, hideActions }: AllReviewsProps) {
    const [page, setPage] = useState<{ value: number }>({ value: 1 });
    const pageRef = useRef<HTMLDivElement>(null);
    const cursor = useRef<string>();
    
    const reviews = usePaginateData<{}, IReview, ReviewsResponse<IReview>>(pageRef, cursor, url, page, setPage, {});

    return (
        <PopUpWrapper setIsOpen={setAllReviewsPopUp} title={title} styles={maxWidth}>
            <div className={`overflow-y-scroll pr-[8px] ${maxHeight} flex gap-7 flex-col`} ref={pageRef}>
                {reviews.data.map((review: IReview, index: number) => {
                    return (
                        <Review 
                            reviewInfo={review} 
                            key={index} 
                            hideActions={hideActions}
                        />
                    )
                })}
            </div>
        </PopUpWrapper>
    )
}

export default AllReviews;