import { useState, useContext } from "react";
import axios, { AxiosError } from "axios";
import { UserContext } from "../../providers/UserProvider";
import ErrorPopUp from "../Error/ErrorPopUp";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";
import { AnimatePresence } from "framer-motion";
import Button from "../ui/Button";
import Rating from "./Rating";
import { MAX_REVIEW_CHARS } from "@freefinder/shared/dist/constants";
import { useWindowSize } from "src/hooks/useWindowSize";
import { SendNotification } from "src/types/SendNotification";

interface CreateReviewProps {
    postID: string,
    sellerID: string,
    hidden: boolean
}

function CreateReview({ postID, sellerID, hidden }: CreateReviewProps) {
    const [serviceAsDescribed, setServiceAsDescribed] = useState<number>(1);
    const [sellerCommunication, setSellerCommunication] = useState<number>(1);
    const [serviceDelivery, setServiceDelivery] = useState<number>(1);
    const [review, setReview] = useState<string>("");
    const userContext = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const windowSize = useWindowSize();

    async function createNewReview(): Promise<string | undefined> {
        try {
            const resp = await axios.post<{ notify: SendNotification | undefined, message: string }>
            (`/api/reviews/${userContext.userData.username}`, {
                serviceAsDescribed: serviceAsDescribed,
                sellerCommunication: sellerCommunication,
                serviceDelivery: serviceDelivery,
                review: review,
                sellerID: sellerID,
                postID: postID
            });

            if (resp.data.notify) {
                userContext.socket?.emit("send-notification", resp.data.notify.notification, resp.data.notify.socketID);
            }

            setServiceAsDescribed(1);
            setSellerCommunication(1);
            setServiceDelivery(1);
            setReview("");
            setErrorMessage("");
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            return errorMessage;
        }
    }

    return (
        <div className={`w-full rounded-[12px] shadow-pop-up p-6 bg-main-blue sticky top-10 flex-grow 
        ${windowSize >= 784 && windowSize < 1130 ? "flex flex-col" : "mt-10"}`}>
            <AnimatePresence>
                {errorMessage !== "" &&
                <ErrorPopUp 
                    errorMessage={errorMessage} 
                    setErrorMessage={setErrorMessage} 
                />}
            </AnimatePresence>
            <h1 className="text-[20px] text-main-white mb-3">
                Rate your experience
            </h1>
            <h2 className="text-main-white mb-[2px]">
                Service as described
            </h2>
            <Rating 
                rating={serviceAsDescribed} 
                setRating={setServiceAsDescribed}
                size={20}
                key="service as described"
            />
            <h2 className="text-main-white mt-5 mb-[2px]">
                Seller communication
            </h2>
            <Rating 
                rating={sellerCommunication} 
                setRating={setSellerCommunication}
                size={20}
                key="seller communication"
            />
            <h2 className="text-main-white mt-5 mb-[2px]">
                Service delivery
            </h2>
            <Rating 
                rating={serviceDelivery} 
                setRating={setServiceDelivery}
                size={20}
                key="service delivery"
            />
            <h2 className="text-main-white mt-5">
                {`Review (max ${MAX_REVIEW_CHARS} characters)`}
            </h2>
            <textarea 
                className={`search-bar bg-transparent text-main-white mt-2 rounded-[8px] placeholder:text-[#fcfcfcec] 
                ${windowSize >= 784 && windowSize < 1130 ? "flex-grow" :""}`}
                placeholder="Summarize your experience with this seller"
                maxLength={MAX_REVIEW_CHARS}
                rows={windowSize >= 1320 ? 9 : 6}
                onChange={(e) => setReview(e.target.value)}
                value={review}
            />
            <Button
                action={createNewReview}
                completedText="Review submitted"
                defaultText="Submit review"
                loadingText="Submitting review"
                styles={`side-btn h-[48px] w-full mt-6 ${hidden || userContext.userData.username === "" ? "invalid-button" : ""}`}
                textStyles={hidden || userContext.userData.username === "" ? "text-disabled-gray" : "text-main-blue"}
                setErrorMessage={setErrorMessage}
                loadingSvgSize={28}
                loadingSvgColour="#4169f7"
            />
        </div>
    )
}

export default CreateReview;