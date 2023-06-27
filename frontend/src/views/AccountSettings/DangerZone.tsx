import { IUserContext } from "../../context/UserContext";
import { useState } from 'react';
import ErrorMessage from "../../components/ErrorMessage";
import { initialState } from "../../context/UserContext";
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";
import Button from "../../components/Button";

function DangerZone({ userContext, setSettingsPopUp }: { userContext: IUserContext, 
    setSettingsPopUp: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [errorMessage, setErrorMessage] = useState<string>("");

    const closeSettingsPopUp = () => {
        setSettingsPopUp(false);
    }

    async function deleteAccount(): Promise<string | undefined> {
        try {
            await axios.delete<{ message: string }>(`/api/users/${userContext.userData.username}`);
            userContext.setUserData(initialState.userData);
        }
        catch(err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            return errorMessage;
        }
    }

    return (
        <>
            {errorMessage !== "" && <ErrorMessage message={errorMessage} title="Failed to delete account" />}
            <h1 className="text-[23px] text-error-text">Delete account</h1>
            <p className="text-side-text-gray mt-1 pb-4">
                Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button
                action={deleteAccount}
                completedText="Account deleted"
                defaultText="Delete account"
                loadingText="Deleting account"
                styles="red-btn"
                textColor="text-error-text"
                setErrorMessage={setErrorMessage}
                whenComplete={closeSettingsPopUp}
            />
        </>
    );
}

export default DangerZone;