import { useState, useContext } from 'react';
import ErrorMessage from "../../components/Error/ErrorMessage";
import { INITIAL_STATE } from "../../providers/UserProvider";
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";
import Button from "../../components/ui/Button";
import { UserContext } from '../../providers/UserProvider';

function DangerZone({ setSettingsPopUp }: { setSettingsPopUp: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [errorMessage, setErrorMessage] = useState<string>("");
    const userContext = useContext(UserContext);

    const resetUserState = () => {
        setSettingsPopUp(false);
        userContext.setUserData(INITIAL_STATE.userData);
    }

    async function deleteAccount(): Promise<string | undefined> {
        try {
            await axios.delete<{ message: string }>(`/api/users/${userContext.userData.username}`);
        }
        catch(err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            return errorMessage;
        }
    }

    return (
        <>
            {errorMessage !== "" && 
            <ErrorMessage 
                message={errorMessage} 
                title="Failed to delete account"
                setErrorMessage={setErrorMessage}
            />}
            <h1 className="text-[18px] text-error-text">
                Delete account
            </h1>
            <p className="text-side-text-gray mt-1 pb-4">
                Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button
                action={deleteAccount}
                completedText="Account deleted"
                defaultText="Delete account"
                loadingText="Deleting account"
                styles="red-btn w-fit"
                textStyles="text-error-text"
                setErrorMessage={setErrorMessage}
                whenComplete={resetUserState}
                loadingSvgSize={24}
                loadingSvgColour="#F43C3C"
                keepErrorMessage={true}
            />
        </>
    );
}

export default DangerZone;