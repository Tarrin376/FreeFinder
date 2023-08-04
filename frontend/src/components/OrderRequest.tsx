import { IMessage } from "../models/IMessage";
import { FoundUsers } from "../types/FoundUsers";
import PackageOverview from "./PackageOverview";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../providers/UserContext";
import OrderSummary from "./OrderSummary";
import { getOrderRequestStatusStyles } from "../utils/getOrderRequestStatusStyles";
import Button from "./Button";
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from "../utils/getAPIErrorMessage";
import { OrderRequestStatus } from "../enums/OrderRequestStatus";
import ErrorPopUp from "./ErrorPopUp";
import { AnimatePresence } from "framer-motion";
import { parseDate } from "../utils/parseDate";

interface OrderRequestProps {
    message: IMessage,
    seller: FoundUsers[number],
    workType: string,
    groupID: string
}

function OrderRequest({ message, seller, workType, groupID }: OrderRequestProps) {
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [status, setStatus] = useState<OrderRequestStatus>(message.orderRequest!.status);
    const [loading, setLoading] = useState<boolean>(false);
    const userContext = useContext(UserContext);

    async function updateOrderStatus(status: OrderRequestStatus, update: boolean): Promise<string | undefined> {
        try {
            const resp = await axios.put<{ updatedMessage: IMessage, message: string }>
            (`/api/users/${userContext.userData.username}/order-requests/${message.orderRequest!.id}`, {
                status: status
            });

            userContext.socket?.emit("send-message", resp.data.updatedMessage, groupID, userContext.userData.username, true);
            if (update) {
                setStatus(status);
            }
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            return errorMessage;
        }
        finally {
            if (update) {
                setLoading(false);
            }
        }
    }

    async function acceptOrderRequest(): Promise<string | undefined> {
        setLoading(true);
        const error = await updateOrderStatus(OrderRequestStatus.ACCEPTED, false);

        if (error) {
            return error;
        }

        setStatus(OrderRequestStatus.ACCEPTED);
    }

    function getStatusText() {
        switch (status) {
            case OrderRequestStatus.PENDING:
                return "Pending";
            case OrderRequestStatus.ACCEPTED:
                return `Accepted on ${parseDate(message.orderRequest!.actionTaken)}`;
            case OrderRequestStatus.CANCELLED:
                return `Cancelled ${parseDate(message.orderRequest!.actionTaken)}`;
            default:
                return `Declined on ${parseDate(message.orderRequest!.actionTaken)}`;
        }
    }

    useEffect(() => {
        setStatus(message.orderRequest!.status);
    }, [message.orderRequest]);

    return (
        <div>
            <AnimatePresence>
                {errorMessage !== "" &&
                <ErrorPopUp
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                />}
            </AnimatePresence>
            <PackageOverview 
                type={message.orderRequest!.package.type}
                revisions={message.orderRequest!.package.revisions}
                seller={seller}
                workType={workType}
                wrapperStyles="my-2 bg-main-white"
                styles="mb-4"
            >
                <OrderSummary 
                    subtotal={message.orderRequest!.package!.amount} 
                    deliveryTime={message.orderRequest!.package!.deliveryTime} 
                    styles="mt-4 pb-4 border-b border-light-border-gray"
                />
                {status === OrderRequestStatus.PENDING &&
                <p className="text-[15px] mt-5">
                    Request expires in:
                    <span className="text-error-text text-[15px]">
                        {` 3 hours`}
                    </span>
                </p>}
                <p className={`text-[15px] ${status === OrderRequestStatus.PENDING ? "mt-[2px]" : "mt-5"}`}>
                    Status:
                    <span className="text-[15px]" style={getOrderRequestStatusStyles(status)}>
                        {` ${getStatusText()}`}
                    </span>
                </p>
                {seller.username === userContext.userData.username && (status === OrderRequestStatus.PENDING || loading) ?
                <div className="mt-5 flex items-center gap-3">
                    <Button
                        action={acceptOrderRequest}
                        defaultText="Accept"
                        loadingText="Accepting request"
                        styles={`bg-light-green side-btn border-none min-w-[110px] hover:bg-light-green-hover ${loading ? "pointer-events-none" : ""}`}
                        textStyles="text-main-white"
                        setErrorMessage={setErrorMessage}
                        loadingSvgSize={20}
                    />
                    <Button
                        action={() => updateOrderStatus(OrderRequestStatus.DECLINED, true)}
                        defaultText="Decline"
                        loadingText="Declining request"
                        styles={`red-btn min-w-[110px] ${loading ? "pointer-events-none" : ""}`}
                        textStyles="text-error-text"
                        setErrorMessage={setErrorMessage}
                        loadingSvgSize={20}
                        loadingSvgColour="#F43C3C"
                    />
                </div> :
                message.from.username === userContext.userData.username && status === OrderRequestStatus.PENDING &&
                <Button
                    action={() => updateOrderStatus(OrderRequestStatus.CANCELLED, true)}
                    defaultText="Cancel request"
                    loadingText="Cancelling request"
                    styles="red-btn mt-5"
                    textStyles="text-error-text"
                    setErrorMessage={setErrorMessage}
                    loadingSvgSize={20}
                    loadingSvgColour="#F43C3C"
                />}
            </PackageOverview>
        </div>
    )
}

export default OrderRequest;