import { IUserContext } from "../../context/UserContext";
import { useState } from 'react';
import ErrorMessage from "../../components/ErrorMessage";
import LoadingButton from "../../components/LoadingButton";
import { initialState } from "../../context/UserContext";

function DangerZone({ userContext, setSettingsPopUp }: { userContext: IUserContext, 
    setSettingsPopUp: React.Dispatch<React.SetStateAction<boolean>> }) {

    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    async function deleteAccount(): Promise<void> {
        setLoading(true);

        try {
            const response = await fetch(`/users/delete`, { 
                method: 'DELETE',
                body: JSON.stringify({
                    userID: userContext.userData.userID
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 500) {
                setErrorMessage(`Looks like we are having trouble on our end. Please try again later. 
                (Error code: ${response.status})`);
            } else if (response.status === 403) {
                setErrorMessage("You do not have authorisation to perform this action");
            } else {
                const deletedUser = await response.json();
                if (deletedUser.message === "success") {
                    userContext.setUserData(initialState.userData);
                    setSettingsPopUp(false);
                } else {
                    setErrorMessage(deletedUser.message);
                }
            }
        }
        catch(err: any) {
            setErrorMessage(err.message);
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
                loading={loading} text="Delete account" loadingText="Deleting account..." 
                callback={deleteAccount} disabled={false} styles={"bg-error-red text-error-text hover:bg-error-red-hover"}
                loadingColour="bg-main-purple"
            />
        </>
    );
}

export default DangerZone;