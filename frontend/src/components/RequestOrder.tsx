import PopUpWrapper from "../wrappers/PopUpWrapper";
import axios, { AxiosError } from "axios";
import { IMessage } from "../models/IMessage";
import { getAPIErrorMessage } from "../utils/getAPIErrorMessage";
import Button from "./Button";
import { IPackage } from "../models/IPackage";
import { UserContext } from "../providers/UserProvider";
import { useContext, useState } from "react";
import ErrorMessage from "./ErrorMessage";
import PackageOverview from "./PackageOverview";
import KeyPair from "./KeyPair";
import { FoundUsers } from "../types/FoundUsers";
import OrderSummary from "./OrderSummary";
import CheckBox from "./CheckBox";
import { SERVICE_FEE, VALID_DURATION_DAYS } from "@freefinder/shared/dist/constants";
import { SendNotification } from "src/types/SendNotification";

interface RequestOrderProps {
    curPkg: IPackage,
    postID: string,
    seller: FoundUsers[number],
    workType: string,
    setRequestOrderPopUp: React.Dispatch<React.SetStateAction<boolean>>
}

function RequestOrder({ curPkg, postID, seller, workType, setRequestOrderPopUp }: RequestOrderProps) {
    const [errorMessage, setErrorMessage] = useState<string>("");
    const userContext = useContext(UserContext);
    const [checked, setChecked] = useState<boolean>(false);

    async function requestAnOrder(): Promise<string | undefined> {
        if (!curPkg) {
            return;
        }

        try {
            const resp = await axios.post<{ 
                newMessage: IMessage, 
                sockets: string[], 
                notify: SendNotification | undefined,
                firstOrderRequest: SendNotification | undefined,
                message: string 
            }>
            (`/api/users/${userContext.userData.username}/order-requests/${seller.userID}/${postID}/${curPkg.type}`);

            for (const socket of resp.data.sockets) {
                userContext.socket?.emit(
                    "send-message", 
                    resp.data.newMessage, 
                    resp.data.newMessage.groupID, 
                    userContext.userData.username, 
                    socket
                );
            }

            if (resp.data.notify) {
                userContext.socket?.emit("send-notification", resp.data.notify.notification, resp.data.notify.socketID);
            }

            if (resp.data.firstOrderRequest) {
                userContext.socket?.emit("send-notification", resp.data.firstOrderRequest.notification, resp.data.firstOrderRequest.socketID);
            }
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            return errorMessage;
        }
    }

    return (
        <PopUpWrapper title="Request an order" setIsOpen={setRequestOrderPopUp}>
            <div>
                {errorMessage !== "" && 
                <ErrorMessage 
                    message={errorMessage} 
                    setErrorMessage={setErrorMessage} 
                    title="Unable to request order"
                />}
                <KeyPair
                    itemKey="Service ID"
                    itemValue={postID}
                    styles="mb-5"
                    textSize={16}
                />
                <PackageOverview 
                    type={curPkg.type}
                    revisions={curPkg.revisions}
                    seller={seller}
                    workType={workType}
                    wrapperStyles="mb-5"
                />
                <h2 className="mb-3">Summary</h2>
                <OrderSummary
                    subTotal={curPkg.amount}
                    total={curPkg.amount + curPkg.amount * SERVICE_FEE}
                    deliveryTime={curPkg.deliveryTime}
                />
                <CheckBox
                    labelName="terms"
                    text={`I understand that the transaction amount will be held by FreeFinder until the order request 
                    has expired (${VALID_DURATION_DAYS} days) or is accepted by the seller. If the delivery window is exceeded, I am permitted 
                    to cancel the order with or without notifying the seller.`}
                    styles="mt-5"
                    setChecked={setChecked}
                />
            </div>
            <Button
                action={requestAnOrder}
                defaultText="Request an order"
                loadingText="Requesting an order"
                styles={`main-btn ${checked ? "" : "invalid-button"}`}
                textStyles="text-main-white"
                setErrorMessage={setErrorMessage}
                loadingSvgSize={28}
                completedText="Order requested"
                keepErrorMessage={true}
                whenComplete={() => setRequestOrderPopUp(false)}
            />
        </PopUpWrapper>
    )
}

export default RequestOrder;