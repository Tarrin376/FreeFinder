import { IMessage } from "../../models/IMessage";
import { FoundUsers } from "../../types/FoundUsers";
import PackageOverview from "../common/PackageOverview";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../providers/UserProvider";
import OrderSummary from "./OrderSummary";
import { getOrderRequestStatusStyles } from "../../utils/getOrderRequestStatusStyles";
import Button from "../ui/Button";
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";
import { OrderRequestStatus } from "../../enums/OrderRequestStatus";
import ErrorPopUp from "../Error/ErrorPopUp";
import { AnimatePresence } from "framer-motion";
import { parseDate } from "../../utils/parseDate";
import { SendNotification } from "src/types/SendNotification";
import { IOrderRequest } from "src/models/IOrderRequest";
import ExpiresIn from "../common/ExpiresIn";

interface OrderRequestProps {
    seller: FoundUsers[number],
    workType: string,
    groupID: string,
    message: IMessage & { 
        orderRequest: IOrderRequest 
    }
}

function OrderRequest({ seller, workType, groupID, message }: OrderRequestProps) {
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [status, setStatus] = useState<OrderRequestStatus>(message.orderRequest.status);
    const [loading, setLoading] = useState<boolean>(false);
    const userContext = useContext(UserContext);

    async function updateOrderStatus(status: OrderRequestStatus): Promise<string | undefined> {
        try {
            setLoading(true);
            const resp = await axios.put<{ updatedMessage: IMessage, sockets: string[], notify: SendNotification | undefined, message: string }>
            (`/api/users/${userContext.userData.username}/order-requests/${message.orderRequest.id}`, {
                status: status
            });

            for (const socket of resp.data.sockets) {
                userContext.socket?.emit(
                    "send-message", 
                    resp.data.updatedMessage, 
                    groupID, 
                    userContext.userData.username, 
                    socket, 
                    true
                );
            }

            if (resp.data.notify) {
                userContext.socket?.emit("send-notification", resp.data.notify.notification, resp.data.notify.socketID);
            }

            setStatus(status);
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            return errorMessage;
        }
        finally {
            setLoading(false);
        }
    }

    function getStatusText() {
        switch (status) {
            case OrderRequestStatus.PENDING:
                return "Pending";
            case OrderRequestStatus.ACCEPTED:
                return `Accepted on ${parseDate(message.orderRequest.actionTaken)}`;
            case OrderRequestStatus.CANCELLED:
                return `Cancelled ${parseDate(message.orderRequest.actionTaken)}`;
            default:
                return `Declined on ${parseDate(message.orderRequest.actionTaken)}`;
        }
    }

    useEffect(() => {
        setStatus(message.orderRequest.status);
    }, [message.orderRequest]);

    return (
        <div className="border border-light-border-gray rounded-[13px] shadow-post w-full overflow-hidden">
            <AnimatePresence>
                {errorMessage !== "" &&
                <ErrorPopUp
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                />}
            </AnimatePresence>
            <PackageOverview 
                type={message.orderRequest.package.type}
                revisions={message.orderRequest.package.revisions}
                seller={seller}
                workType={workType}
                wrapperStyles="bg-main-white"
                styles="mb-4"
            >
                <OrderSummary 
                    subTotal={message.orderRequest.subTotal} 
                    total={message.orderRequest.total}
                    deliveryTime={message.orderRequest.package.deliveryTime} 
                    styles="mt-4 pb-4 border-b border-light-border-gray"
                />
                {status === OrderRequestStatus.PENDING &&
                <ExpiresIn 
                    expires={new Date(message.orderRequest.expires)} 
                    styles="mt-5"
                />}
                <p className={`text-[15px] ${status === OrderRequestStatus.PENDING ? "mt-[2px]" : "mt-5"}`}>
                    Status:
                    <span className="text-[15px]" style={getOrderRequestStatusStyles(status)}>
                        {` ${getStatusText()}`}
                    </span>
                </p>
                {seller.username === userContext.userData.username && (status === OrderRequestStatus.PENDING || loading) ?
                <div className="mt-5 flex items-center gap-3">
                    <Button
                        action={() => updateOrderStatus(OrderRequestStatus.ACCEPTED)}
                        defaultText="Accept"
                        loadingText="Accepting request"
                        styles={`bg-light-green side-btn border-none min-w-[110px] hover:bg-light-green-hover ${loading ? "pointer-events-none" : ""}`}
                        textStyles="text-main-white"
                        setErrorMessage={setErrorMessage}
                        loadingSvgSize={20}
                    />
                    <Button
                        action={() => updateOrderStatus(OrderRequestStatus.DECLINED)}
                        defaultText="Decline"
                        loadingText="Declining request"
                        styles={`red-btn min-w-[110px] ${loading ? "pointer-events-none" : ""}`}
                        textStyles="text-error-text"
                        setErrorMessage={setErrorMessage}
                        loadingSvgSize={20}
                        loadingSvgColour="#F43C3C"
                    />
                </div> : message.from.username === userContext.userData.username && status === OrderRequestStatus.PENDING &&
                <Button
                    action={() => updateOrderStatus(OrderRequestStatus.CANCELLED)}
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