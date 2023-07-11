import { useState, useContext } from 'react';
import ErrorMessage from "../../components/ErrorMessage";
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";
import Button from "../../components/Button";
import { UserContext } from '../../providers/UserContext';

function ChangePassword() {
    const [currentPass, setCurrentPass] = useState<string>("");
    const [newPass, setNewPass] = useState<string>("");
    const [confirmNewPass, setConfirmNewPass] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const userContext = useContext(UserContext);

    const [validNewPass, setValidNewPass] = useState<boolean>(false);
    const [validConfirmNewPass, setValidConfirmNewPass] = useState<boolean>(false);
    const [validCurrentPass, setValidCurrentPass] = useState<boolean>(false);

    async function updatePassword(): Promise<string | undefined> {
        const passwordMatch: boolean = await checkPassword();
        if (!passwordMatch) {
            return "The password you provided does not match your current password.";
        }

        try {
            await axios.put<{ message: string }>(`/api/users/${userContext.userData.username}/password`, { 
                password: newPass 
            });
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>)
            return errorMessage;
        }
    }

    async function checkPassword(): Promise<boolean> {
        try {
            await axios.post<{ message: string }>(`/api/users/${userContext.userData.username}`, { password: currentPass });
            return true;
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            setErrorMessage(errorMessage);
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
            <h1 className="text-[20px]">Password</h1>
            <p className="text-side-text-gray mt-1 pb-4 border-b border-b-nav-search-gray">
                Please enter your current password to change your password
            </p>
            <div className="flex mt-7 flex-col gap-4">
                <div>
                    {errorMessage !== "" && 
                    <ErrorMessage 
                        message={errorMessage} 
                        title="Failed to update password"
                        setErrorMessage={setErrorMessage}
                    />}
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
                <Button
                    action={updatePassword}
                    completedText="Password updated"
                    defaultText="Update details"
                    loadingText="Checking password"
                    styles={!checkInputs() ? "invalid-button mt-3 main-btn" : "mt-3 main-btn"}
                    textStyles="text-main-white"
                    setErrorMessage={setErrorMessage}
                    keepErrorMessage={true}
                />
            </div>
        </>
    );
}

export default ChangePassword;