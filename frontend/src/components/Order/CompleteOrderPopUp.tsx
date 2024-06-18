import PopUpWrapper from "src/wrappers/PopUpWrapper";
import CheckBox from "../CheckBox";
import { useState, useContext } from "react";
import Button from "../Button";
import ErrorMessage from "../Error/ErrorMessage";
import KeyPair from "../KeyPair";
import PackageOverview from "../PackageOverview";
import { PackageTypes } from "src/enums/PackageTypes";
import { FoundUsers } from "src/types/FoundUsers";
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from "src/utils/getAPIErrorMessage";
import { UserContext } from "src/providers/UserProvider";

interface CompleteOrderPopUpProps {
    setCompleteOrderPopUp: React.Dispatch<React.SetStateAction<boolean>>,
    postID: string,
    packageType: PackageTypes,
    revisions: string,
    orderID: string,
    seller: Omit<FoundUsers[number], 'userID'>,
    workType: string
}

function CompleteOrderPopUp({ setCompleteOrderPopUp, postID, packageType, revisions, orderID, seller, workType }: CompleteOrderPopUpProps) {
    const userContext = useContext(UserContext);
    const [checked, setChecked] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    async function requestOrderCompletion(): Promise<string | undefined> {
        try {
            await axios.post<{ message: string }>
            (`/api/sellers/${userContext.userData.seller?.sellerID}/orders/${orderID}/complete-order-requests`);
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            return errorMessage;
        }
    }

    return (
        <PopUpWrapper setIsOpen={setCompleteOrderPopUp} title="Finish order">
            <div>
                {errorMessage !== "" && 
                <ErrorMessage 
                    message={errorMessage} 
                    setErrorMessage={setErrorMessage} 
                    title="Unable to finish order"
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
                    text="After this order is filled, the client will be notified and asked whether they believe that
                    the service has been fulfilled. If they agree that the service was delivered, you will receive your
                    compensation within the next few hours. However, if the client disagrees with the quality of your
                    service, please discuss the issues with the client and notify support if you believe that the client
                    is being unfair in their decision."
                    styles="mt-5"
                    setChecked={setChecked}
                />
            </div>
            <Button
                action={requestOrderCompletion}
                defaultText="Finish order"
                loadingText="Sending request to finish order"
                styles={`main-btn ${checked ? "" : "invalid-button"}`}
                textStyles="text-main-white"
                setErrorMessage={setErrorMessage}
                loadingSvgSize={28}
                completedText="Request sent"
                keepErrorMessage={true}
                whenComplete={() => setCompleteOrderPopUp(false)}
            />
        </PopUpWrapper>
    )
}

export default CompleteOrderPopUp;