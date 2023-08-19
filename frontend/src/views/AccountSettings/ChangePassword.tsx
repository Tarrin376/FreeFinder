import { useState, useContext } from 'react';
import ErrorMessage from "../../components/ErrorMessage";
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";
import Button from "../../components/Button";
import { UserContext } from '../../providers/UserProvider';
import { MIN_PASS_LENGTH, MAX_PASS_LENGTH } from "@freefinder/shared/dist/constants";
import TextBoxErrorMessage from 'src/components/TextBoxErrorMessage';

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
        try {
            await axios.put<{ message: string }>(`/api/users/${userContext.userData.username}/password`, { 
                newPass: newPass,
                currentPass: currentPass
            });
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>)
            return errorMessage;
        }
    }

    function checkInputs(): boolean {
        return validCurrentPass && validNewPass && validConfirmNewPass && newPass === confirmNewPass;
    }

    function updatePass(pass: string, setValid: React.Dispatch<React.SetStateAction<boolean>>, 
    setPass: React.Dispatch<React.SetStateAction<string>>): void {
        setPass(pass);
        if (pass.length >= MIN_PASS_LENGTH && pass.length <= MAX_PASS_LENGTH) {
            setValid(true);
        } else {
            setValid(false);
        }
    }

    return (
        <>
            <h1 className="text-[18px]">Password</h1>
            <p className="text-side-text-gray mt-1 pb-4 border-b border-b-nav-search-gray">
                Please enter your current password to change your password
            </p>
            <form className="flex mt-7 flex-col gap-4">
                <div>
                    {errorMessage !== "" && 
                    <ErrorMessage 
                        message={errorMessage} 
                        title="Failed to update password"
                        setErrorMessage={setErrorMessage}
                    />}
                    <p className="mb-2">Current password</p>
                    <input 
                        type="password" 
                        className={`search-bar ${validCurrentPass || currentPass === "" ? '' : 'invalid-input'}`}
                        placeholder="Enter your current password"
                        onChange={(e) => updatePass(e.target.value, setValidCurrentPass, setCurrentPass)}
                        autoComplete="current-password" 
                    />
                    {!validCurrentPass && currentPass !== "" &&
                    <TextBoxErrorMessage
                        error={`Password must be between ${MIN_PASS_LENGTH} and ${MAX_PASS_LENGTH} characters long.`}
                    />}
                </div>
                <div>
                    <p className="mb-2">New password</p>
                    <input 
                        type="password" 
                        className={`search-bar ${validNewPass || newPass === "" ? '' : 'invalid-input'}`} 
                        placeholder="Enter your new password"
                        onChange={(e) => updatePass(e.target.value, setValidNewPass, setNewPass)} 
                        autoComplete="new-password"
                    />
                    {!validNewPass && newPass !== "" &&
                    <TextBoxErrorMessage
                        error={`Password must be between ${MIN_PASS_LENGTH} and ${MAX_PASS_LENGTH} characters long.`}
                    />}
                </div>
                <div>
                    <p className="mb-2">Confirm new password</p>
                    <input 
                        type="password" 
                        className={`search-bar ${confirmNewPass === "" || (validConfirmNewPass && confirmNewPass === newPass) ? '' : 'invalid-input'}`} 
                        placeholder="Re-enter your new password"
                        onChange={(e) => updatePass(e.target.value, setValidConfirmNewPass, setConfirmNewPass)}
                        autoComplete="new-password"
                    />
                    {(confirmNewPass !== "" && (!validConfirmNewPass || confirmNewPass !== newPass)) &&
                    <TextBoxErrorMessage
                        error={confirmNewPass !== newPass ? 
                        "Passwords do not match." : 
                        `Password must be between ${MIN_PASS_LENGTH} and ${MAX_PASS_LENGTH} characters long.`}
                    />}
                </div>
                <Button
                    action={updatePassword}
                    completedText="Password updated"
                    defaultText="Update details"
                    loadingText="Checking password"
                    styles={!checkInputs() ? "invalid-button mt-3 main-btn" : "mt-3 main-btn"}
                    textStyles="text-main-white"
                    setErrorMessage={setErrorMessage}
                    loadingSvgSize={28}
                    keepErrorMessage={true}
                />
            </form>
        </>
    );
}

export default ChangePassword;