import { ICompleteOrderRequest } from "src/models/ICompleteOrderRequest";
import { IMessage } from "src/models/IMessage";
import { CompleteOrderRequestStatus } from "src/enums/CompleteOrderRequestStatus";
import ExpiresIn from "../ExpiresIn";
import axios, { AxiosError } from "axios";
import ErrorPopUp from "../Error/ErrorPopUp";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

interface CompleteOrderRequestProps {
    message: IMessage & { completeOrderRequest: ICompleteOrderRequest }
}

function CompleteOrderRequest({ message }: CompleteOrderRequestProps) {
    const [errorMessage, setErrorMessage] = useState<string>("");

    async function completeOrder(): Promise<void> {
        try {
            
        }
        catch (err: any) {

        }
    }

    async function declineRequest(): Promise<void> {
        try {
            
        }
        catch (err: any) {

        }
    }

    return (
        <div className="border border-light-border-gray rounded-[13px] shadow-post w-full p-4">
            <AnimatePresence>
                {errorMessage !== "" &&
                <ErrorPopUp
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                />}
            </AnimatePresence>
            {message.completeOrderRequest.status === CompleteOrderRequestStatus.PENDING ? 
            <>
                <p className="mb-2">{message.messageText}</p>
                <ExpiresIn 
                    expires={new Date(message.completeOrderRequest.expires)} 
                    styles="mb-4"
                />
                <div className="flex gap-4 justify-between">
                    <button className="btn-primary bg-main-blue text-main-white w-1/2 hover:bg-main-blue-hover"
                    onClick={completeOrder}>
                        Complete order
                    </button>
                    <button className="red-btn w-1/2" onClick={declineRequest}>
                        Decline request
                    </button>
                </div>
            </> :
            message.completeOrderRequest.status === CompleteOrderRequestStatus.DECLINED ?
            <p className="text-error-text">
                The request to complete the order was declined by the client.
            </p> :
            <div>
            </div>}
        </div>
    )
}

export default CompleteOrderRequest;