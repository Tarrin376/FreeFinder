import PopUpWrapper from "src/wrappers/PopUpWrapper";
import CheckBox from "../CheckBox";
import { useState } from "react";
import Button from "../Button";
import ErrorMessage from "../Error/ErrorMessage";
import KeyPair from "../KeyPair";
import PackageOverview from "../PackageOverview";
import { PackageTypes } from "src/enums/PackageTypes";
import { FoundUsers } from "src/types/FoundUsers";

interface CompleteOrderPopUpProps {
    setCompleteOrderPopUp: React.Dispatch<React.SetStateAction<boolean>>,
    postID: string,
    packageType: PackageTypes,
    revisions: string,
    seller: Omit<FoundUsers[number], 'userID'>,
    workType: string
}

function CompleteOrderPopUp({ setCompleteOrderPopUp, postID, packageType, revisions, seller, workType }: CompleteOrderPopUpProps) {
    const [checked, setChecked] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    async function requestOrderCompletion(): Promise<string | undefined> {
        return "";
    }

    return (
        <PopUpWrapper setIsOpen={setCompleteOrderPopUp} title="Complete order">
            <div>
                {errorMessage !== "" && 
                <ErrorMessage 
                    message={errorMessage} 
                    setErrorMessage={setErrorMessage} 
                    title="Unable to complete order"
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
                    text="After the completion of this order, the client will be notified and asked whether they believe that
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
                defaultText="Complete order"
                loadingText="Requesting order completion"
                styles={`main-btn ${checked ? "" : "invalid-button"}`}
                textStyles="text-main-white"
                setErrorMessage={setErrorMessage}
                loadingSvgSize={28}
                completedText="Order completion request sent"
                keepErrorMessage={true}
                whenComplete={() => setCompleteOrderPopUp(false)}
            />
        </PopUpWrapper>
    )
}

export default CompleteOrderPopUp;