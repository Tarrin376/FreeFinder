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
            setErrorMessage("The password you provided does not match your current password.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/users/update/password", {
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

            if (response.status === 500) {
                setErrorMessage(`Looks like we are having trouble on our end. Please try again later. 
                (Error code: ${response.status})`);
            } else if (response.status === 403) {
                setErrorMessage("You do not have authorisation to perform this action");
            } else {
                const updatedPassword = await response.json();
                if (updatedPassword.message === "success") {
                    setCompleted(true);
                    setErrorMessage("");
                    actionSuccessful(setCompleted, true, false);
                } else {
                    setErrorMessage(updatedPassword.message);
                }
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
            const response = await fetch("/api/users/getUser", {
                method: 'POST',
                body: JSON.stringify({ 
                    password: currentPass,
                    usernameOrEmail: userContext.userData.username
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (response.status !== 500) {
                const user = await response.json();
                if (user.message === "success") {
                    return true;
                } else {
                    setErrorMessage(user.message);
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
                    <p className="text-box-error-message">
                        {!validCurrentPass && currentPass !== "" ? "Password must be 8 or more characters long" : ""}
                    </p>
                </div>
                <div>
                    <p className="mb-2">New password</p>
                    <input type="password" className={`search-bar ${validNewPass || newPass === "" ? '' : 'invalid-input'}`} 
                    placeholder="Enter your new password"
                    onChange={(e) => updatePass(e.target.value, setValidNewPass, setNewPass)} />
                    <p className="text-box-error-message">
                        {!validNewPass && newPass !== "" ? "Password must be 8 or more characters long" : ""}
                    </p>
                </div>
                <div>
                    <p className="mb-2">Confirm new password</p>
                    <input type="password" className={`search-bar ${(validConfirmNewPass || confirmNewPass === "")
                    && confirmNewPass === newPass ? '' : 'invalid-input'}`} placeholder="Re-enter your new password"
                    onChange={(e) => updatePass(e.target.value, setValidConfirmNewPass, setConfirmNewPass)} />
                    <p className="text-box-error-message">
                        {!validConfirmNewPass && confirmNewPass !== "" ? "Password must be 8 or more characters long" : 
                        confirmNewPass !== newPass ? "Passwords do not match" : ""}
                    </p>
                </div>
                <LoadingButton 
                    loading={loading} text="Update Details" loadingText="Checking password..." 
                    callback={updatePassword} styles={!checkInputs() ? "invalid-button mt-3 main-btn" : "mt-3 main-btn"}
                    disabled={!checkInputs()} loadingColour="bg-main-black" completed={completed} 
                    completedText="Password updated successfully"
                />
            </div>
        </>
    );
}

export default ChangePassword;