import { IUserContext } from "../../context/UserContext";
import { useState } from 'react';
import ErrorMessage from "../../components/ErrorMessage";
import LoadingButton from "../../components/LoadingButton";
import { initialState } from "../../context/UserContext";
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";

function DangerZone({ userContext, setSettingsPopUp }: { userContext: IUserContext, 
    setSettingsPopUp: React.Dispatch<React.SetStateAction<boolean>> }) {

    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    async function deleteAccount(): Promise<void> {
        setLoading(true);

        try {
            await axios.delete<{ message: string }>(`/api/users/${userContext.userData.userID}`);
            userContext.setUserData(initialState.userData);
            setSettingsPopUp(false);
        }
        catch(err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            setErrorMessage(errorMessage);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <>
            {errorMessage !== "" && <ErrorMessage message={errorMessage} title="Failed to delete account" />}
            <h1 className="text-[23px] text-error-text">Delete account</h1>
            <p className="text-side-text-gray mt-1 pb-4">
                Once you delete your account, there is no going back. Please be certain.
            </p>
            <LoadingButton 
                loading={loading} text="Delete account" loadingText="Deleting account" 
                callback={deleteAccount} disabled={false} styles={"bg-error-red text-error-text hover:bg-error-red-hover"}
                loadingColour="bg-main-blue"
            />
        </>
    );
}

export default DangerZone;