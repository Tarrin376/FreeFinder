import { IUserContext } from "../context/UserContext";
import PopUpWrapper from "../layouts/PopUpWrapper";
import ProfilePicAndStatus from "./ProfilePicAndStatus";
import { useState, useRef } from 'react';
import ErrorMessage from "./ErrorMessage";
import CountriesDropdown from "./CountriesDropdown";
import { emailPattern } from "./SignUp";
import LoadingButton from "./LoadingButton";
import { fetchUpdatedUser } from "../utils/fetchUpdatedUser";
import { UpdateResponse } from "../utils/fetchUpdatedUser";
import { initialState } from "../context/UserContext";
import { actionSuccessful } from "../utils/actionSuccessful";

interface SettingsProps {
    setSettingsPopUp: React.Dispatch<React.SetStateAction<boolean>>,
    userContext: IUserContext
}

enum Options {
    details,
    profile,
    password,
    dangerZone
}

function Settings({ setSettingsPopUp, userContext }: SettingsProps) {
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [option, setOption] = useState<Options>(Options.details);
    const [loading, setLoading] = useState<boolean>(false);

    function updateOption(next: Options): void {
        setOption(next);
    }

    return (
        <PopUpWrapper setIsOpen={setSettingsPopUp} title={"Settings"}>
            {errorMessage !== "" && <ErrorMessage message={errorMessage} title={"Unable to upload image"} />}
            <div className="flex gap-5">
                <div className="relative">
                    <ProfilePicAndStatus profilePicURL={userContext.userData.profilePicURL} profileStatus={userContext.userData.status} 
                    statusStyles="before:left-[55px] before:top-[60px] before:w-5 before:h-5" imgStyles="w-[80px] h-[80px]" showEdit={true} 
                    setErrorMessage={setErrorMessage} loading={loading} setLoading={setLoading} />
                </div>
                <div>
                    <p>Username: <span className="text-main-purple">{userContext.userData.username}</span></p>
                    <p>Country: <span className="text-main-purple">{userContext.userData.country}</span></p>
                    <p>Email: <span className="text-main-purple">{userContext.userData.email}</span></p>
                </div>
            </div>
            <div className="mt-9 mb-5">
                <ul className="border-b border-b-nav-search-gray flex justify-between mt-5">
                    <li className={option === Options.details ? "settings-selection" : "settings-unselected"}
                    onClick={() => updateOption(Options.details)}>My details</li>
                    <li className={option === Options.profile ? "settings-selection" : "settings-unselected"}
                    onClick={() => updateOption(Options.profile)}>Profile</li>
                    <li className={option === Options.password ? "settings-selection" : "settings-unselected"}
                    onClick={() => updateOption(Options.password)}>Password</li>
                    <li className={option === Options.dangerZone ? "settings-selection" : "settings-unselected"}
                    onClick={() => updateOption(Options.dangerZone)}>Danger Zone</li>
                </ul>
            </div>
            {option === Options.details && <MyDetails userContext={userContext} />}
            {option === Options.profile && <Profile userContext={userContext} />}
            {option === Options.password && <Password userContext={userContext} />}
            {option === Options.dangerZone && <DangerZone userContext={userContext} setSettingsPopUp={setSettingsPopUp} />}
        </PopUpWrapper>
    );
}

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
            const updated: UpdateResponse = await fetchUpdatedUser(userContext.userData.username, { 
                ...userContext.userData, 
                email: firstEmail 
            });
            
            if (updated.message === "success" && updated.userData) {
                userContext.setUserData(updated.userData);
                setErrorMessage("");
                actionSuccessful(setCompleted);
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
            <p className="text-side-text-gray mt-1 pb-4 border-b border-b-nav-search-gray mb-7">Change your details</p>
            <div className="flex flex-col gap-4">
                <div>
                    {errorMessage !== "" && <ErrorMessage message={errorMessage} title="Failed to update email address" />}
                    <p className="mb-2">Email address</p>
                    <input type="text" className={`search-bar ${!validFirst && firstEmail !== "" && "invalid-input"}`} 
                    placeholder="Change email address"
                    onChange={(e) => emailChangeHandler(e.target.value, setValidFirst, setFirstEmail)} />
                </div>
                <div>
                    <p className="mb-2">Confirm email address</p>
                    <input type="text" 
                    className={`search-bar ${(!validSecond || firstEmail !== secondEmail) && secondEmail !== "" && "invalid-input"}`} 
                    placeholder="Re-enter your email address"
                    onChange={(e) => emailChangeHandler(e.target.value, setValidSecond, setSecondEmail)} />
                </div>
                <LoadingButton 
                    loading={loading} text="Update Details" loadingText="Checking details..." 
                    callback={updateDetails} styles={(!validFirst || !validSecond || firstEmail !== secondEmail) ? "invalid-button mt-3 main-btn" : "main-btn mt-3"}
                    disabled={!validFirst || !validSecond || firstEmail !== secondEmail} loadingColour="bg-main-black"
                    completed={completed} completedText="Details updated successfully"
                />
            </div>
        </>
    );
}

function Profile({  userContext }: { userContext: IUserContext }) {
    const [username, setUsername] = useState<string>(userContext.userData.username);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const country = useRef<HTMLSelectElement>(null);
    const [completed, setCompleted] = useState<boolean>(false);
    
    async function updateProfile(): Promise<void> {
        try {
            setLoading(true);
            const updated: UpdateResponse = await fetchUpdatedUser(userContext.userData.username, { 
                ...userContext.userData, 
                username, 
                country: country.current!.value 
            });

            if (updated.message === "success" && updated.userData) {
                userContext.setUserData(updated.userData);
                setErrorMessage("");
                actionSuccessful(setCompleted);
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
            <h1 className="text-[23px]">Profile</h1>
            <p className="text-side-text-gray mt-1 pb-4 border-b border-b-nav-search-gray">Customize your profile</p>
            <div className="flex mt-7 flex-col gap-4">
                <div>
                    {errorMessage !== "" && <ErrorMessage message={errorMessage} title="Failed to update username" />}
                    <p className="mb-2">Username</p>
                    <input type="text" name="change-username" className={`search-bar ${username === "" && "invalid-input"}`} 
                    value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <p className="mb-2">Country</p>
                    <CountriesDropdown country={country} selected={userContext.userData.country} />
                </div>
                <LoadingButton 
                    loading={loading} text="Update Profile" loadingText="Checking username..." 
                    callback={updateProfile} styles={username === "" ? "invalid-button main-btn mt-3" : "mt-3 main-btn"}
                    disabled={username === ""} loadingColour="bg-main-black" completed={completed} 
                    completedText="Profile updated successfully"
                />
            </div>
        </>
    )
}

function Password({ userContext }: { userContext: IUserContext }) {
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
            const updatePassword = await fetch("user/update/password", {
                method: 'PUT',
                body: JSON.stringify({
                    userID: userContext.userData.userID,
                    password: newPass 
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then((res) => {
                return res.json();
            });

            if (updatePassword.message === "success") {
                setCompleted(true);
                setErrorMessage("");
                actionSuccessful(setCompleted);
            } else {
                setErrorMessage(updatePassword.message);
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
            const response = await fetch(`/user/findUser/${userContext.userData.username}`, {
                method: 'POST',
                body: JSON.stringify({ password: currentPass }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            const user = await response.json();
            if (user.userData) {
                return true;
            } else {
                if (user.error) setErrorMessage(user.error);
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

    function setPass(pass: string, setValid: React.Dispatch<React.SetStateAction<boolean>>, 
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
                    onChange={(e) => setPass(e.target.value, setValidCurrentPass, setCurrentPass)} />
                </div>
                <div>
                    <p className="mb-2">New password</p>
                    <input type="password" className={`search-bar ${validNewPass || newPass === "" ? '' : 'invalid-input'}`} 
                    placeholder="Enter your new password"
                    onChange={(e) => setPass(e.target.value, setValidNewPass, setNewPass)} />
                </div>
                <div>
                    <p className="mb-2">Confirm new password</p>
                    <input type="password" className={`search-bar ${validConfirmNewPass || confirmNewPass === "" ? '' : 'invalid-input'}`} 
                    placeholder="Re-enter your new password"
                    onChange={(e) => setPass(e.target.value, setValidConfirmNewPass, setConfirmNewPass)} />
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

function DangerZone({ userContext, setSettingsPopUp }: { userContext: IUserContext, 
    setSettingsPopUp: React.Dispatch<React.SetStateAction<boolean>> }) {

    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    async function deleteAccount(): Promise<void> {
        setLoading(true);

        try {
            const deleteUser = await fetch(`/user/deleteUser`, { 
                method: 'DELETE',
                body: JSON.stringify({
                    userID: userContext.userData.userID
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then((res) => {
                return res.json();
            });

            if (deleteUser.message === "success") {
                userContext.setUserData(initialState.userData);
                setSettingsPopUp(false);
            } else {
                setErrorMessage(deleteUser.message);
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
            <h1 className="text-[23px] text-error-red">Delete account</h1>
            <p className="text-side-text-gray mt-1 pb-4">
                Once you delete your account, there is no going back. Please be certain.
            </p>
            <LoadingButton 
                loading={loading} text="Delete account" loadingText="Deleting account..." 
                callback={deleteAccount} disabled={false} styles={"bg-error-red text-main-white hover:bg-[#c10002]"}
                loadingColour="bg-main-purple"
            />
        </>
    );
}

export default Settings;