import { ICompleteOrderRequest } from "src/models/ICompleteOrderRequest";
import { IMessage } from "src/models/IMessage";
import { OrderRequestStatus } from "src/enums/OrderRequestStatus";
import ExpiresIn from "../ExpiresIn";
import axios, { AxiosError } from "axios";
import ErrorPopUp from "../Error/ErrorPopUp";
import { AnimatePresence } from "framer-motion";
import { useState, useContext } from "react";
import { getAPIErrorMessage } from "src/utils/getAPIErrorMessage";
import OrderSummary from "./OrderSummary";
import CheckMark from "../CheckMark";
import { UserContext } from "src/providers/UserProvider";

interface CompleteOrderRequestProps {
    message: IMessage & { 
        completeOrderRequest: ICompleteOrderRequest 
    }
}

function CompleteOrderRequest({ message }: CompleteOrderRequestProps) {
    const [status, setStatus] = useState<OrderRequestStatus>(message.completeOrderRequest.status);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const userContext = useContext(UserContext);

    async function completeOrder(): Promise<void> {
        try {
            await axios.put<{ message: string }>
            (`/api/sellers/${message.completeOrderRequest.order.sellerID}/orders/${message.completeOrderRequest.order.orderID}/complete-order-requests/${message.completeOrderRequest.id}`, {
                status: OrderRequestStatus.ACCEPTED
            });

            setStatus(OrderRequestStatus.ACCEPTED);
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            setErrorMessage(errorMessage);
        }
    }

    async function declineRequest(): Promise<void> {
        try {
            await axios.put<{ message: string }>
            (`/api/sellers/${message.completeOrderRequest.order.sellerID}/orders/${message.completeOrderRequest.order.orderID}/complete-order-requests/${message.completeOrderRequest.id}`, {
                status: OrderRequestStatus.DECLINED
            });

            setStatus(OrderRequestStatus.DECLINED);
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            setErrorMessage(errorMessage);
        }
    }

    async function cancelRequest(): Promise<void> {

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
            {status === OrderRequestStatus.PENDING ? 
            <>
                <p className="mb-2">{message.messageText}</p>
                <OrderSummary 
                    subTotal={message.completeOrderRequest.order.subTotal} 
                    total={message.completeOrderRequest.order.total}
                    styles="mt-4 pb-4 border-b border-light-border-gray"
                />
                <ExpiresIn 
                    expires={new Date(message.completeOrderRequest.expires)} 
                    styles="mb-4 mt-4"
                />
                {message.completeOrderRequest.order.clientID === userContext.userData.userID ?
                <div className="flex gap-4 justify-between">
                    <button className="btn-primary bg-main-blue text-main-white w-1/2 hover:bg-main-blue-hover"
                    onClick={completeOrder}>
                        Complete order
                    </button>
                    <button className="red-btn w-1/2" onClick={declineRequest}>
                        Decline request
                    </button>
                </div> : 
                <div>
                    <button className="red-btn" onClick={cancelRequest}>
                        Cancel request
                    </button>
                </div>}
            </> :
            status === OrderRequestStatus.DECLINED ?
            <p className="text-error-text">
                The request to complete the order was declined by the client.
            </p> :
            status === OrderRequestStatus.ACCEPTED &&
            <div>
                <CheckMark 
                    size={70}
                    styles="m-auto mb-2"
                />
                <h3>
                    {`Congratulations! ${message.completeOrderRequest.order.clientID === userContext.userData.userID ? "Your" : "The"} order is now complete!`}
                </h3>
                <OrderSummary 
                    subTotal={message.completeOrderRequest.order.subTotal} 
                    total={message.completeOrderRequest.order.total}
                    styles="mt-4 pb-4 border-b border-light-border-gray"
                />
                <div className="flex gap-2 mt-4 justify-between">
                    <p className="text-sm text-side-text-gray">
                        {`Want to leave feedback for the ${message.completeOrderRequest.order.clientID === userContext.userData.userID ? "seller" : "client"}?`}
                    </p>
                    <p className="text-main-blue text-sm cursor-pointer underline">
                        Click here
                    </p>
                </div>
            </div>}
        </div>
    )
}

export default CompleteOrderRequest;