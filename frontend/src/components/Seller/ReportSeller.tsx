import PopUpWrapper from "src/wrappers/PopUpWrapper";
import ErrorMessage from "../Error/ErrorMessage";
import { UserContext } from "src/providers/UserProvider";
import { useState, useContext } from "react";
import { getAPIErrorMessage } from "src/utils/getAPIErrorMessage";
import Button from "../ui/Button";
import axios, { AxiosError } from "axios";

interface ReportSellerProps {
    setReportSellerPopUp: React.Dispatch<React.SetStateAction<boolean>>,
    username: string,
    sellerID: string
}

function ReportSeller({ setReportSellerPopUp, username, sellerID }: ReportSellerProps) {
    const [description, setDescription] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const userContext = useContext(UserContext);

    function updateDescription(e: React.ChangeEvent<HTMLTextAreaElement>): void {
        const description = e.target.value.trimStart();
        setDescription(description);
    }

    async function report(): Promise<string | undefined> {
        try {
            await axios.post<{ message: string }>
            (`/api/users/${userContext.userData.username}/reports/${sellerID}`, {
                description: description
            });
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            return errorMessage;
        }
    }

    return (
        <PopUpWrapper setIsOpen={setReportSellerPopUp} title={`Report ${username}`}>
            <div>
                {errorMessage !== "" && 
                <ErrorMessage 
                    message={errorMessage} 
                    setErrorMessage={setErrorMessage} 
                    title="Something went wrong"
                />}
                <h3 className="mb-2">
                    Reasoning for the report
                </h3>
                <textarea 
                    placeholder={`Write about why you are reporting ${username} here`}
                    className="w-full search-bar mb-4" 
                    rows={5} 
                    maxLength={250} 
                    onChange={updateDescription} 
                    value={description} 
                />
            </div>
            <Button
                action={report}
                defaultText="Report seller"
                loadingText="Reporting seller"
                styles={`main-btn red-btn ${description.length > 0 ? "" : "invalid-button"}`}
                textStyles={description.length > 0 ? "text-error-text" : "text-main-white"}
                setErrorMessage={setErrorMessage}
                loadingSvgSize={28}
                loadingSvgColour="#F43C3C"
                completedText="Seller reported"
                keepErrorMessage={true}
                whenComplete={() => setReportSellerPopUp(false)}
            />
        </PopUpWrapper>
    )
}

export default ReportSeller;