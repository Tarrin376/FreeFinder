import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";
import { ReviewsResponse } from "../../types/ReviewsResponse";
import Review from "./Review";
import { IReview } from "../../models/IReview";
import AllReviews from "./AllReviews";
import { AnimatePresence } from "framer-motion";
import ErrorPopUp from "../Error/ErrorPopUp";
import StarSvg from "./StarSvg";
import { RatingAverages } from "../../types/RatingAverages";
import { StarCounts } from "../../types/StarCounts";
import Rating from "./Rating";
import { useWindowSize } from "src/hooks/useWindowSize";
import Arrow from "../Arrow";

interface ReviewsProps {
    url: string,
    reviewsRef?: React.RefObject<HTMLDivElement>
}

interface RatingAverageProps {
    title: string,
    average: number,
    styles?: string
}

const INITIAL_RATING_AVERAGES = {
    rating: 0,
    serviceAsDescribed: 0,
    sellerCommunication: 0,
    serviceDelivery: 0
}

const INITIAL_STARS: StarCounts = [0, 0, 0, 0, 0];
const QUERY_LIMIT = 3;

function Reviews({ url, reviewsRef }: ReviewsProps) {
    const [reviews, setReviews] = useState<ReviewsResponse<IReview>>();
    const [averages, setAverages] = useState<RatingAverages>(INITIAL_RATING_AVERAGES);
    const [starCounts, setStarCounts] = useState<StarCounts>(INITIAL_STARS);
    const [allReviewsPopUp, setAllReviewsPopUp] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const windowSize = useWindowSize();

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const resp = await axios.post<ReviewsResponse<IReview>>(url, { limit: QUERY_LIMIT });
                if (resp.data.averages) setAverages(resp.data.averages);
                if (resp.data.starCounts) setStarCounts(resp.data.starCounts);
                setReviews(resp.data);
            }
            catch (err: any) {
                const errorMessage = getAPIErrorMessage(err as AxiosError<{ message : string }>);
                setErrorMessage(errorMessage);
            }
        })();
    }, [url]);

    if (!reviews) {
        return (
            <AnimatePresence>
                {errorMessage !== "" && 
                <ErrorPopUp 
                    errorMessage={errorMessage} 
                    setErrorMessage={setErrorMessage}
                    key="error"
                />}
            </AnimatePresence>
        )
    }

    return (
        <div className="mt-10" ref={reviewsRef}>
            <AnimatePresence>
                {allReviewsPopUp && 
                <AllReviews 
                    url={url}
                    setAllReviewsPopUp={setAllReviewsPopUp}
                    styles="max-w-[780px] !h-[780px]"
                    title={`Ratings and reviews (${reviews.count})`}
                />}
                {errorMessage !== "" && 
                <ErrorPopUp 
                    errorMessage={errorMessage} 
                    setErrorMessage={setErrorMessage} 
                />}
            </AnimatePresence>
            <div className="flex items-center gap-2 h-[52px] mb-3">
                <h2 className="text-[1.3rem]">
                    Ratings and reviews
                </h2>
                {reviews.count > QUERY_LIMIT &&
                <Arrow
                    action={() => setAllReviewsPopUp(true)}
                    direction="right"
                    alt="See all reviews"
                    size={52}
                />}
            </div>
            <div className={`flex ${windowSize >= 450 ? "gap-7" : "gap-5"} items-end mb-6`}>
                <div className="w-fit">
                    <p className={`${windowSize >= 450 ? "text-[60px]" : "text-[50px]"} mb-[-10px] text-center`}>
                        {averages.rating ? averages.rating.toFixed(1) : 0}
                    </p>
                    <Rating 
                        rating={averages.rating ?? 0} 
                        size={16} 
                    />
                    <p className="text-side-text-gray text-sm text-center mt-[2px]">
                        {`${reviews.count} ${reviews.count === 1 ? "review" : "reviews"}`}
                    </p>
                </div>
                <div className="flex-grow flex flex-col gap-[1px]">
                    {new Array(5).fill(0).map((_, index: number) => {
                        return (
                            <div className="flex items-center gap-3" key={index}>
                                <p className="text-sm text-side-text-gray">{5 - index}</p>
                                <div className="flex-grow rounded-full h-[13px] bg-very-light-gray">
                                    <div className="bg-main-blue h-full w-[200px] rounded-full" 
                                    style={{ width: reviews.count > 0 ? `calc(100% / ${(reviews.count)} * ${starCounts[4 - index]}` : '0px' }}>
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
                    average={averages.serviceAsDescribed ?? 0}
                    styles="mb-[2px] pb-[6px] border-b border-light-border-gray" 
                />
                <RatingAverage 
                    title="Seller communication" 
                    average={averages.sellerCommunication ?? 0} 
                    styles="py-[6px] mb-[2px] border-b border-light-border-gray"
                />
                <RatingAverage 
                    title="Service delivery" 
                    average={averages.serviceDelivery ?? 0}
                    styles="pt-[6px]"
                />
            </div>
            <div className="flex gap-7 flex-col">
                {reviews.next.map((review: IReview) => {
                    return (
                        <Review 
                            reviewInfo={review} 
                            key={review.reviewID} 
                        />
                    )
                })}
            </div>
            {reviews.count > QUERY_LIMIT &&
            <button className="mt-7 btn-primary text-main-blue bg-highlight hover:bg-highlight-hover"
            onClick={() => setAllReviewsPopUp(true)}>
                See all reviews
            </button>}
        </div>
    )
}

function RatingAverage({ title, average, styles }: RatingAverageProps) {
    const defaultStyles = `flex items-center justify-between`;

    return (
        <div className={`${defaultStyles} ${styles}`}>
            <p className="text-side-text-gray text-sm">{title}</p>
            <div className="flex items-center gap-2">
                <StarSvg
                    backgroundColour="#EEB424"
                    size={14}
                />
                <p className="text-[#EEB424] text-sm">
                    {average.toFixed(1)}
                </p>
            </div>
        </div>
    )
}

export default Reviews;