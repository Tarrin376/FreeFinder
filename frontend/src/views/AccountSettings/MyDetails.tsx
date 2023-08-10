import { useState, useContext } from 'react';
import ErrorMessage from "../../components/ErrorMessage";
import { EMAIL_REGEX } from '@freefinder/shared/dist/constants';
import { fetchUpdatedUser } from "../../utils/fetchUpdatedUser";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";
import { AxiosError } from "axios";
import Button from "../../components/Button";
import { UserContext } from '../../providers/UserProvider';

function MyDetails() {
    const [firstEmail, setFirstEmail] = useState<string>("");
    const [secondEmail, setSecondEmail] = useState<string>("");
    const [validFirst, setValidFirst] = useState<boolean>(false);
    const [validSecond, setValidSecond] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const userContext = useContext(UserContext);

    function emailChangeHandler(input: string, setValid: React.Dispatch<React.SetStateAction<boolean>>,
        setEmail: React.Dispatch<React.SetStateAction<string>>): void {

        setValid(input.match(EMAIL_REGEX) !== null);
        setEmail(input);
    }

    async function updateDetails(): Promise<string | undefined> {
        try {
            const updated = await fetchUpdatedUser({ 
                ...userContext.userData, 
                email: firstEmail 
            }, userContext.userData.username);
            
            userContext.setUserData(updated.userData);
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            return errorMessage;
        }
    }

    return (
        <>
            <h1 className="text-[18px]">My Details</h1>
            <p className="text-side-text-gray mt-1 pb-4 border-b border-b-nav-search-gray mb-7">
                Change your details
            </p>
            <div className="flex flex-col gap-4">
                <div>
                    {errorMessage !== "" && 
                    <ErrorMessage 
                        message={errorMessage} 
                        title="Failed to update email address" 
                        setErrorMessage={setErrorMessage}
                    />}
                    <p className="mb-2">Email address</p>
                    <input 
                        type="text" 
                        className={`search-bar ${!validFirst && firstEmail !== "" && "invalid-input"}`} 
                        placeholder="Change email address"
                        onChange={(e) => emailChangeHandler(e.target.value, setValidFirst, setFirstEmail)} 
                    />
                    <p className="text-box-error-message">
                        {!validFirst && firstEmail !== "" ? "Please use a valid email address" : ""}
                    </p>
                </div>
                <div>
                    <p className="mb-2">Confirm email address</p>
                    <input 
                        type="text" 
                        className={`search-bar ${((!validSecond  && secondEmail !== "") || firstEmail !== secondEmail) && "invalid-input"}`} 
                        placeholder="Re-enter your email address" onChange={(e) => emailChangeHandler(e.target.value, setValidSecond, setSecondEmail)}
                        onPaste={(e) => {
                            e.preventDefault();
                            return false;
                        }}
                    />
                    <p className="text-box-error-message">
                        {!validSecond && secondEmail !== "" ? "Please use a valid email address" : 
                        firstEmail !== secondEmail ? "Email address does not match" : ""}
                    </p>
                </div>
                <Button
                    action={updateDetails}
                    completedText="Details updated successfully"
                    defaultText="Update details"
                    loadingText="Checking details"
                    styles={(!validFirst || !validSecond || firstEmail !== secondEmail) ? "invalid-button mt-3 main-btn" : "main-btn mt-3"}
                    textStyles="text-main-white"
                    setErrorMessage={setErrorMessage}
                    loadingSvgSize={28}
                    keepErrorMessage={true}
                />
            </div>
        </>
    );
}

export default MyDetails;