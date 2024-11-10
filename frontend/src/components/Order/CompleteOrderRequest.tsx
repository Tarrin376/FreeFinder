import { ICompleteOrderRequest } from "src/models/ICompleteOrderRequest";
import { IMessage } from "src/models/IMessage";
import { OrderRequestStatus } from "src/enums/OrderRequestStatus";
import ExpiresIn from "../common/ExpiresIn";
import axios, { AxiosError } from "axios";
import ErrorPopUp from "../Error/ErrorPopUp";
import { AnimatePresence } from "framer-motion";
import { useState, useContext } from "react";
import { getAPIErrorMessage } from "src/utils/getAPIErrorMessage";
import OrderSummary from "./OrderSummary";
import CheckMarkSvg from "../svg/CheckMarkSvg";
import { UserContext } from "src/providers/UserProvider";
import { SendNotification } from "src/types/SendNotification";
import KeyPair from "../common/KeyPair";

interface CompleteOrderRequestProps {
    message: IMessage & { 
        completeOrderRequest: ICompleteOrderRequest 
    }
}

function CompleteOrderRequest({ message }: CompleteOrderRequestProps) {
    const [status, setStatus] = useState<OrderRequestStatus>(message.completeOrderRequest.status);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const userContext = useContext(UserContext);

    const clientURL = `/api/users/${userContext.userData.username}/orders/${message.completeOrderRequest.order.orderID}/complete-order-requests/${message.completeOrderRequest.id}`;
    const sellerURL = `/api/sellers/${message.completeOrderRequest.order.sellerID}/orders/${message.completeOrderRequest.order.orderID}/complete-order-requests/${message.completeOrderRequest.id}`;

    async function completeOrder(): Promise<void> {
        try {
            const resp = await axios.put<{ notify?: SendNotification, message: string }>
            (clientURL, { status: OrderRequestStatus.ACCEPTED });
            
            if (resp.data.notify) {
                userContext.socket?.emit("send-notification", resp.data.notify.notification, resp.data.notify.socketID);
            }

            setStatus(OrderRequestStatus.ACCEPTED);
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            setErrorMessage(errorMessage);
        }
    }

    async function declineRequest(): Promise<void> {
        try {
            const resp = await axios.put<{ notify?: SendNotification, message: string }>
            (clientURL, { status: OrderRequestStatus.DECLINED });

            if (resp.data.notify) {
                userContext.socket?.emit("send-notification", resp.data.notify.notification, resp.data.notify.socketID);
            }

            setStatus(OrderRequestStatus.DECLINED);
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            setErrorMessage(errorMessage);
        }
    }

    async function cancelRequest(): Promise<void> {
        try {
            await axios.put<{ message: string }>(sellerURL, { status: OrderRequestStatus.CANCELLED });
            setStatus(OrderRequestStatus.CANCELLED);
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            setErrorMessage(errorMessage);
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
                        Finish order
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
            <p className="text-error-text text-center">
                The request to finish the order was declined.
            </p> :
            status === OrderRequestStatus.ACCEPTED ?
            <div>
                <CheckMarkSvg 
                    size={70}
                    styles="m-auto"
                />
                <h3 className="text-center mt-2 mb-3 text-[17px]">
                    {`${message.completeOrderRequest.order.clientID !== userContext.userData.userID ? "This" : "Your"} order has been filled!`}
                </h3>
                <KeyPair 
                    itemKey="Order ID" 
                    itemValue={message.completeOrderRequest.order.orderID} 
                    textSize={15} 
                    styles="text-side-text-gray mb-4"
                />
                <OrderSummary 
                    subTotal={message.completeOrderRequest.order.subTotal} 
                    total={message.completeOrderRequest.order.clientID === userContext.userData.userID ? message.completeOrderRequest.order.total : message.completeOrderRequest.order.subTotal}
                    onlyShowTotal={message.completeOrderRequest.order.clientID !== userContext.userData.userID}
                    styles={`${message.completeOrderRequest.order.clientID === userContext.userData.userID ? "py-4" : "pb-4"} border-y border-light-border-gray`}
                />
                <div className="flex gap-2 mt-4 justify-between">
                    <p className="text-sm text-side-text-gray">
                        {`Want to leave feedback for the ${message.completeOrderRequest.order.clientID === userContext.userData.userID ? "seller" : "client"}?`}
                    </p>
                    <p className="text-main-blue text-sm cursor-pointer underline">
                        Click here
                    </p>
                </div>
            </div> :
            <p className="text-error-text text-center">
                The request to finish the order was cancelled by the seller.
            </p>}
        </div>
    )
}

export default CompleteOrderRequest;