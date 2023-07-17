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
import StarSvg from "./StarSvg";
import { RatingAverages } from "../types/RatingAverages";
import { StarCounts } from "../types/StarCounts";

interface ReviewsProps {
    url: string,
    postID: string
}

interface RatingAverageProps {
    title: string,
    average: number,
    styles?: string
}

const initialRatingAverages = {
    rating: 0,
    serviceAsDescribed: 0,
    sellerCommunication: 0,
    serviceDelivery: 0
}

const initialStars: StarCounts = [0, 0, 0, 0, 0];
const queryLimit = 3;

function Reviews({ url, postID }: ReviewsProps) {
    const [reviews, setReviews] = useState<ReviewsResponse<IReview>>();
    const [averages, setAverages] = useState<RatingAverages>(initialRatingAverages);
    const [starCounts, setStarCounts] = useState<StarCounts>(initialStars);
    const [allReviewsPopUp, setAllReviewsPopUp] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const resp = await axios.post<ReviewsResponse<IReview>>(`${url}/${postID}`, { limit: queryLimit });
                if (resp.data.averages) setAverages(resp.data.averages);
                if (resp.data.starCounts) setStarCounts(resp.data.starCounts);
                setReviews(resp.data);
            }
            catch (err: any) {
                const errorMessage = getAPIErrorMessage(err as AxiosError<{ message : string }>);
                setErrorMessage(errorMessage);
            }
        })();
    }, [url, postID]);

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
                    postID={postID}
                    setAllReviewsPopUp={setAllReviewsPopUp}
                />}
            </AnimatePresence>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 h-[52px]">
                    <h2 className="text-[1.3rem]">Ratings and reviews for this service</h2>
                    {reviews.count > queryLimit &&
                    <div className="w-[52px] h-full flex items-center justify-center 
                    hover:bg-hover-light-gray rounded-full cursor-pointer" onClick={() => setAllReviewsPopUp(true)}>
                        <img src={RightArrowIcon} alt="" className="w-[26px] h-[26px]" />
                    </div>}
                </div>
                <p className="text-[15px] text-side-text-gray">Not all reviews are verified</p>
            </div>
            <div className="flex gap-7 items-center mb-6">
                <div className="w-fit">
                    <p className="text-[3.5rem] text-center">{averages.rating.toFixed(1)}</p>
                    <p className="text-side-text-gray text-sm text-center">{`${reviews.count} ${reviews.count === 1 ? "review" : "reviews"}`}</p>
                </div>
                <div className="flex-grow flex flex-col gap-[1px]">
                    {new Array(5).fill(0).map((_, index: number) => {
                        return (
                            <div className="flex items-center gap-3" key={index}>
                                <p className="text-sm text-side-text-gray">{5 - index}</p>
                                <div className="flex-grow rounded-full h-[14px] bg-very-light-gray">
                                    <div className="bg-main-blue h-full w-[200px] rounded-full" 
                                    style={{ width: `calc(100% / ${(reviews.count)} * ${starCounts[4 - index]}`}}>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="mb-12">
                <p className="mb-3">Rating breakdown</p>
                <RatingAverage 
                    title="Service as described" 
                    average={averages.serviceAsDescribed}
                    styles="mb-[2px] pb-[6px] border-b border-light-border-gray" 
                />
                <RatingAverage 
                    title="Seller communication" 
                    average={averages.sellerCommunication} 
                    styles="py-[6px] mb-[2px] border-b border-light-border-gray"
                />
                <RatingAverage 
                    title="Service delivery" 
                    average={averages.serviceDelivery}
                    styles="pt-[6px]"
                />
            </div>
            <div className="flex gap-7 flex-col">
                {reviews.next.map((review: IReview, index: number) => {
                    return (
                        <Review 
                            reviewInfo={review} 
                            postID={postID}
                            key={index} 
                        />
                    )
                })}
            </div>
            {reviews.count > queryLimit &&
            <button className="mt-7 btn-primary text-main-blue bg-highlight hover:bg-highlight-hover"
            onClick={() => setAllReviewsPopUp(true)}>
                See all reviews
            </button>}
        </div>
    )
}

function RatingAverage({ title, average, styles }: RatingAverageProps) {
    return (
        <div className={`flex items-center justify-between ${styles}`}>
            <p className="text-side-text-gray text-sm">{title}</p>
            <div className="flex items-center gap-2">
                <StarSvg
                    backgroundColour="#EEB424"
                    size="14px"
                />
                <p className="text-[#EEB424] text-sm">
                    {average.toFixed(1)}
                </p>
            </div>
        </div>
    )
}

export default Reviews;