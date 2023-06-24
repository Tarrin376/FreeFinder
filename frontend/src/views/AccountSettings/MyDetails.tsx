import { IUserContext } from "../../context/UserContext";
import { useState } from 'react';
import ErrorMessage from "../../components/ErrorMessage";
import { emailPattern } from "../../components/SignUp";
import LoadingButton from "../../components/LoadingButton";
import { fetchUpdatedUser } from "../../utils/fetchUpdatedUser";
import { UpdateResponse } from "../../utils/fetchUpdatedUser";
import { actionSuccessful } from "../../utils/actionSuccessful";

function MyDetails({ userContext } : { userContext: IUserContext }) {
    const [firstEmail, setFirstEmail] = useState<string>("");
    const [secondEmail, setSecondEmail] = useState<string>("");
    const [validFirst, setValidFirst] = useState<boolean>(false);
    const [validSecond, setValidSecond] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [completed, setCompleted] = useState<boolean>(false);

    function emailChangeHandler(input: string, setValid: React.Dispatch<React.SetStateAction<boolean>>,
        setEmail: React.Dispatch<React.SetStateAction<string>>): void {

        const validEmail: boolean = input.match(emailPattern) !== null;
        if (validEmail) setValid(true);
        else setValid(false);
        setEmail(input);
    }

    async function updateDetails(): Promise<void> {
        try {
            setLoading(true);
            const updated: UpdateResponse = await fetchUpdatedUser({ 
                ...userContext.userData, 
                email: firstEmail 
            });
            
            if (updated.message === "success" && updated.userData) {
                userContext.setUserData(updated.userData);
                setErrorMessage("");
                actionSuccessful(setCompleted, true, false);
            } else {
                setErrorMessage(updated.message);
            }
        }
        catch (err: any) {
            setErrorMessage(err.message);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <>
            <h1 className="text-[23px]">My Details</h1>
            <p className="text-side-text-gray mt-1 pb-4 border-b border-b-nav-search-gray mb-7">
                Change your details
            </p>
            <div className="flex flex-col gap-4">
                <div>
                    {errorMessage !== "" && <ErrorMessage message={errorMessage} title="Failed to update email address" />}
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
                <LoadingButton 
                    loading={loading} text="Update Details" loadingText="Checking details" 
                    callback={updateDetails} styles={(!validFirst || !validSecond || firstEmail !== secondEmail) ? "invalid-button mt-3 main-btn" : "main-btn mt-3"}
                    disabled={!validFirst || !validSecond || firstEmail !== secondEmail} loadingColour="bg-main-black"
                    completed={completed} completedText="Details updated successfully"
                />
            </div>
        </>
    );
}

export default MyDetails;