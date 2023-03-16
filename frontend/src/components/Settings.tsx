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

interface SettingsProps {
    setSettingsPopUp: React.Dispatch<React.SetStateAction<boolean>>,
    userContext: IUserContext
}

enum Options {
    details,
    profile,
    password
}

function Settings({ setSettingsPopUp, userContext }: SettingsProps) {
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [option, setOption] = useState<Options>(Options.details);
    const [loading, setLoading] = useState<boolean>(false);

    function updateOption(next: Options): void {
        setOption(next);
    }

    return (
        <PopUpWrapper setIsOpen={setSettingsPopUp}>
            {errorMessage !== "" && <ErrorMessage message={errorMessage} title={"Unable to upload image"} />}
            <div className="flex gap-5">
                <div className="relative">
                    <ProfilePicAndStatus profilePicURL={userContext.userData.profilePicURL} profileStatus={userContext.userData.status} 
                    statusStyles="before:left-[55px] before:top-[60px] before:w-5 before:h-5" imgStyles="w-[80px] h-[80px]" showEdit={true} 
                    setErrorMessage={setErrorMessage} loading={loading} setLoading={setLoading} />
                </div>
                <div>
                    <p>Username: <span className="text-main-red">{userContext.userData.username}</span></p>
                    <p>Country: <span className="text-main-red">{userContext.userData.country}</span></p>
                    <p>Email: <span className="text-main-red">{userContext.userData.email}</span></p>
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
                </ul>
            </div>
            {option === Options.details && <MyDetails userContext={userContext} />}
            {option === Options.profile && <Profile userContext={userContext} />}
            {option === Options.password && <Password userContext={userContext} />}
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
            const updated: UpdateResponse = await fetchUpdatedUser(userContext.userData.username, { ...userContext.userData, email: firstEmail });
            if (updated.message === "success" && updated.userData) {
                userContext.setUserData(updated.userData);
                setErrorMessage("");
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
        <div>
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
                    loading={loading} text="Update Details" loadingText="Checking details" 
                    callback={updateDetails} styles={(!validFirst || !validSecond || firstEmail !== secondEmail) ? "invalid-button mt-3" : "mt-3"}
                    disabled={!validFirst || !validSecond || firstEmail !== secondEmail}
                />
            </div>
        </div>
    );
}

function Profile({  userContext }: { userContext: IUserContext }) {
    const [username, setUsername] = useState<string>(userContext.userData.username);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const country = useRef<HTMLSelectElement>(null);
    
    async function updateProfile(): Promise<void> {
        try {
            setLoading(true);
            const updated: UpdateResponse = await fetchUpdatedUser(userContext.userData.username, { ...userContext.userData, username, country: country.current!.value });
            if (updated.message === "success" && updated.userData) {
                userContext.setUserData(updated.userData);
                setErrorMessage("");
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
        <div>
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
                    loading={loading} text="Update Details" loadingText="Checking details" 
                    callback={updateProfile} styles={username === "" ? "invalid-button mt-3" : "mt-3"}
                    disabled={username === ""}
                />
            </div>
        </div>
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

    async function updatePassword(): Promise<void> {
        setLoading(true);

        const passwordMatch = await checkPasswordMatch();
        if (!passwordMatch) {
            setLoading(false);
            setErrorMessage("The current password you provided does not match your password.");
            return;
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
        catch (e: any) {
            setErrorMessage(e.message);
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
        <div>
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
                    loading={loading} text="Update Details" loadingText="Checking password" 
                    callback={updatePassword} styles={!checkInputs() ? "invalid-button mt-3" : "mt-3"}
                    disabled={!checkInputs()}
                />
            </div>
        </div>
    )
}

export default Settings;