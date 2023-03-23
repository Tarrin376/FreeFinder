import { IUserContext } from "../../context/UserContext";
import { useState } from 'react';
import ErrorMessage from "../../components/ErrorMessage";
import LoadingButton from "../../components/LoadingButton";
import { actionSuccessful } from "../../utils/actionSuccessful";

function ChangePassword({ userContext }: { userContext: IUserContext }) {
    const [currentPass, setCurrentPass] = useState<string>("");
    const [newPass, setNewPass] = useState<string>("");
    const [confirmNewPass, setConfirmNewPass] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const [validNewPass, setValidNewPass] = useState<boolean>(false);
    const [validConfirmNewPass, setValidConfirmNewPass] = useState<boolean>(false);
    const [validCurrentPass, setValidCurrentPass] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [completed, setCompleted] = useState<boolean>(false);

    async function updatePassword(): Promise<void> {
        setLoading(true);

        const passwordMatch = await checkPasswordMatch();
        if (!passwordMatch) {
            setErrorMessage("The current password you provided does not match your password.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("update/profile/password", {
                method: 'PUT',
                body: JSON.stringify({
                    userID: userContext.userData.userID,
                    password: newPass 
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.status !== 500) {
                const updatedPassword = await response.json();
                if (updatedPassword.message === "success") {
                    setCompleted(true);
                    setErrorMessage("");
                    actionSuccessful(setCompleted, true, false);
                } else {
                    setErrorMessage(updatedPassword.message);
                }
            } else {
                setErrorMessage(`Looks like we are having trouble on our end. Please try again later. 
                (Error code: ${response.status})`);
            }
        }
        catch (err: any) {
            setErrorMessage(err.message);
        }
        finally {
            setLoading(false);
        }
    }

    async function checkPasswordMatch(): Promise<boolean> {
        try {
            const response = await fetch(`/users/find/${userContext.userData.username}`, {
                method: 'POST',
                body: JSON.stringify({ password: currentPass }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (response.status !== 500) {
                const user = await response.json();
                if (user.userData) {
                    return true;
                } else {
                    if (user.error) setErrorMessage(user.error);
                    return false;
                }
            } else {
                setErrorMessage(`Looks like we are having trouble on our end. Please try again later. 
                (Error code: ${response.status})`);
                return false;
            }
        }
        catch (err: any) {
            setErrorMessage(err.message);
            return false;
        }
    }

    function checkInputs(): boolean {
        return validCurrentPass && validNewPass && validConfirmNewPass && newPass === confirmNewPass;
    }

    function updatePass(pass: string, setValid: React.Dispatch<React.SetStateAction<boolean>>, 
    setPass: React.Dispatch<React.SetStateAction<string>>): void {
        setPass(pass);
        if (pass.length >= 8) {
            setValid(true);
        } else {
            setValid(false);
        }
    }

    return (
        <>
            <h1 className="text-[23px]">Password</h1>
            <p className="text-side-text-gray mt-1 pb-4 border-b border-b-nav-search-gray">
                Please enter your current password to change your password
            </p>
            <div className="flex mt-7 flex-col gap-4">
                <div>
                    {errorMessage !== "" && <ErrorMessage message={errorMessage} title="Failed to update password" />}
                    <p className="mb-2">Current password</p>
                    <input type="password" className={`search-bar ${validCurrentPass || currentPass === "" ? '' : 'invalid-input'}`}
                    placeholder="Enter your current password"
                    onChange={(e) => updatePass(e.target.value, setValidCurrentPass, setCurrentPass)} />
                </div>
                <div>
                    <p className="mb-2">New password</p>
                    <input type="password" className={`search-bar ${validNewPass || newPass === "" ? '' : 'invalid-input'}`} 
                    placeholder="Enter your new password"
                    onChange={(e) => updatePass(e.target.value, setValidNewPass, setNewPass)} />
                </div>
                <div>
                    <p className="mb-2">Confirm new password</p>
                    <input type="password" className={`search-bar ${validConfirmNewPass || confirmNewPass === "" ? '' : 'invalid-input'}`} 
                    placeholder="Re-enter your new password"
                    onChange={(e) => updatePass(e.target.value, setValidConfirmNewPass, setConfirmNewPass)} />
                </div>
                <LoadingButton 
                    loading={loading} text="Update Details" loadingText="Checking password..." 
                    callback={updatePassword} styles={!checkInputs() ? "invalid-button mt-3 main-btn" : "mt-3 main-btn"}
                    disabled={!checkInputs()} loadingColour="bg-main-black" completed={completed} 
                    completedText="Password updated successfully"
                />
            </div>
        </>
    )
}

export default ChangePassword;