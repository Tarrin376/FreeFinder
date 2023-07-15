import RightArrowIcon from "../assets/right-arrow.png";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from "../utils/getAPIErrorMessage";
import { ReviewsResponse } from "../types/ReviewsResponse";
import Review from "./Review";
import { IReview } from "../models/IReview";
import AllReviews from "./AllReviews";
import { AnimatePresence } from "framer-motion";
import ErrorPopUp from "./ErrorPopUp";

interface ReviewsProps {
    url: string
}

const queryLimit = 3;

function Reviews({ url }: ReviewsProps) {
    const [reviews, setReviews] = useState<ReviewsResponse<IReview>>();
    const [allReviewsPopUp, setAllReviewsPopUp] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const resp = await axios.post<ReviewsResponse<IReview>>(url, { limit: queryLimit });
                setReviews(resp.data);
            }
            catch (err: any) {
                const errorMessage = getAPIErrorMessage(err as AxiosError<{ message : string }>);
                setErrorMessage(errorMessage);
            }
        })();
    }, [url]);

    if (!reviews) {
        return <p>loading</p>
    }

    if (!reviews.count) {
        return (
            <>
                {errorMessage !== "" && 
                <ErrorPopUp 
                    errorMessage={errorMessage} 
                    setErrorMessage={setErrorMessage} 
                />}
            </>
        )
    }

    return (
        <div className="mt-10">
            <AnimatePresence>
                {allReviewsPopUp && 
                <AllReviews 
                    url={url}
                    setAllReviewsPopUp={setAllReviewsPopUp}
                />}
            </AnimatePresence>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <h2 className="text-[1.3rem]">Ratings and reviews</h2>
                    <div className="w-[52px] h-[52px] flex items-center justify-center 
                    hover:bg-hover-light-gray rounded-full cursor-pointer" onClick={() => setAllReviewsPopUp(true)}>
                        <img src={RightArrowIcon} alt="" className="w-[26px] h-[26px]" />
                    </div>
                </div>
                <p className="text-[15px] text-side-text-gray">Ratings and reviews are verified</p>
            </div>
            <div className="flex gap-7 items-center mb-12">
                <div className="w-fit">
                    <p className="text-[3.5rem] text-center">{reviews.avgRating.toFixed(1)}</p>
                    <p className="text-side-text-gray text-sm text-center">{`${reviews.count} ${reviews.count === 1 ? "review" : "reviews"}`}</p>
                </div>
                <div className="flex-grow flex flex-col gap-[1px]">
                    {new Array(5).fill(0).map((_, index: number) => {
                        return (
                            <div className="flex items-center gap-3" key={index}>
                                <p className="text-sm text-side-text-gray">{5 - index}</p>
                                <div className="flex-grow rounded-full h-[14px] bg-very-light-gray">
                                    <div className="bg-main-blue h-full w-[200px] rounded-full" 
                                    style={{ width: `calc(100% / ${(reviews.count)} * ${reviews.stars[4 - index]}`}}>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="flex gap-7 flex-col">
                {reviews.next.map((review: IReview, index: number) => {
                    return (
                        <Review 
                            reviewInfo={review} 
                            key={index} 
                        />
                    )
                })}
            </div>
            <button className="mt-7 btn-primary text-main-blue bg-highlight hover:bg-highlight-hover"
            onClick={() => setAllReviewsPopUp(true)}>
                See all reviews
            </button>
        </div>
    )
}

export default Reviews;