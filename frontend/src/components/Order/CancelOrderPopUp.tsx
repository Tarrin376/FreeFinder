import PopUpWrapper from "src/wrappers/PopUpWrapper";
import CheckBox from "../CheckBox";
import { useState, useContext } from "react";
import Button from "../Button";
import ErrorMessage from "../Error/ErrorMessage";
import KeyPair from "../KeyPair";
import PackageOverview from "../PackageOverview";
import { PackageTypes } from "src/enums/PackageTypes";
import { FoundUsers } from "src/types/FoundUsers";
import { UserContext } from "src/providers/UserProvider";
import { getAPIErrorMessage } from "src/utils/getAPIErrorMessage";
import axios, { AxiosError } from "axios";
import { SendNotification } from "src/types/SendNotification";

interface CancelOrderPopUpProps {
    setCancelOrderPopUp: React.Dispatch<React.SetStateAction<boolean>>,
    postID: string,
    packageType: PackageTypes,
    revisions: string,
    workType: string,
    orderID: string,
    seller: Omit<FoundUsers[number], 'userID'>
}

function CancelOrderPopUp({ setCancelOrderPopUp, postID, packageType, revisions, workType, orderID, seller }: CancelOrderPopUpProps) {
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [checked, setChecked] = useState<boolean>(false);
    const userContext = useContext(UserContext);

    async function cancelOrder(): Promise<string | undefined> {
        try {
            const resp = await axios.delete<{ notify: SendNotification | undefined, message: string }>
            (`/api/sellers/${userContext.userData.seller?.sellerID}/orders/${orderID}`);

            if (resp.data.notify) {
                userContext.socket?.emit("send-notification", resp.data.notify.notification, resp.data.notify.socketID);
            }
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            return errorMessage;
        }
    }

    return (
        <PopUpWrapper setIsOpen={setCancelOrderPopUp} title="Cancel order">
            <div>
                {errorMessage !== "" && 
                <ErrorMessage 
                    message={errorMessage} 
                    setErrorMessage={setErrorMessage} 
                    title="Unable to cancel order"
                />}
                <KeyPair
                    itemKey="Service ID"
                    itemValue={postID}
                    styles="mb-5"
                    textSize={16}
                />
                <PackageOverview 
                    type={packageType}
                    revisions={revisions}
                    seller={seller}
                    workType={workType}
                    wrapperStyles="mb-5"
                />
                <CheckBox
                    labelName="terms"
                    text="By cancelling this order, you agree that you will not receive any compensation from the client
                    and will not be able to continue this order unless the client explicitly requests to continue this
                    order by making another order request."
                    styles="mt-5"
                    setChecked={setChecked}
                />
            </div>
            <Button
                action={cancelOrder}
                defaultText="Cancel order"
                loadingText="Cancelling order"
                styles={`main-btn red-btn ${checked ? "" : "invalid-button"}`}
                textStyles={checked ? "text-error-text" : "text-main-white"}
                setErrorMessage={setErrorMessage}
                loadingSvgSize={28}
                completedText="Order cancelled"
                keepErrorMessage={true}
                whenComplete={() => setCancelOrderPopUp(false)}
            />
        </PopUpWrapper>
    )
}

export default CancelOrderPopUp;