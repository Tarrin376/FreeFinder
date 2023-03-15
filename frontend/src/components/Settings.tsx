import { IUserContext } from "../context/UserContext";
import PopUpWrapper from "../layouts/PopUpWrapper";
import ProfilePicAndStatus from "./ProfilePicAndStatus";
import { useState, useRef, SetStateAction } from 'react';
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

interface SectionProps {
    userContext: IUserContext,
    loading: boolean,
    setLoading: React.Dispatch<SetStateAction<boolean>>,
}

interface ProfileProps extends SectionProps {
    country: React.RefObject<HTMLSelectElement>
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
    const country = useRef<HTMLSelectElement>(null);

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
                    setErrorMessage={setErrorMessage} />
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
            {option === Options.details && <MyDetails userContext={userContext} loading={loading} setLoading={setLoading} />}
            {option === Options.profile && <Profile country={country} userContext={userContext} loading={loading} setLoading={setLoading} />}
            {option === Options.password && <Password userContext={userContext} loading={loading} setLoading={setLoading} />}
        </PopUpWrapper>
    );
}

function MyDetails({ userContext, loading, setLoading }: SectionProps) {
    const [firstEmail, setFirstEmail] = useState<string>("");
    const [secondEmail, setSecondEmail] = useState<string>("");
    const [validFirst, setValidFirst] = useState<boolean>(false);
    const [validSecond, setValidSecond] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    function emailChangeHandler(input: string, setValid: React.Dispatch<React.SetStateAction<boolean>>,
        setEmail: React.Dispatch<React.SetStateAction<string>>) {

        const validEmail: boolean = input.match(emailPattern) !== null;
        if (validEmail) setValid(true);
        else setValid(false);
        setEmail(input);
    }

    async function updateDetails() {
        const updated: Promise<UpdateResponse> = fetchUpdatedUser(userContext.userData.username, {...userContext.userData, email: firstEmail});
        updated.then((response) => {
            if (response.status === 200 && response.userData) {
                userContext.setUserData(response.userData);
            } else {
                setErrorMessage(response.message);
            }
        }).catch((err) => {
            setErrorMessage(err.message);
        });

        setLoading(false);
    }

    return (
        <div>
            <h1 className="text-[23px]">My Details</h1>
            <p className="text-side-text-gray mt-1 pb-4 border-b border-b-nav-search-gray mb-7">Change your details</p>
            <div className="flex flex-col gap-4">
                <div>
                    {errorMessage !== "" && <ErrorMessage message={errorMessage} title="Failed to update email address" />}
                    <p className="mb-2">Email address</p>
                    <input type="text" className={`search-bar ${!validFirst && firstEmail !== "" && "invalid-input"}`} placeholder="Change email address"
                    onChange={(e) => emailChangeHandler(e.target.value, setValidFirst, setFirstEmail)} />
                </div>
                <div>
                    <p className="mb-2">Confirm email address</p>
                    <input type="text" 
                    className={`search-bar ${(!validSecond || firstEmail !== secondEmail) && secondEmail !== "" && "invalid-input"}`} placeholder="Re-enter your email address"
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

function Profile({ country, userContext, loading, setLoading }: ProfileProps) {
    const [username, setUsername] = useState<string>(userContext.userData.username);
    
    return (
        <div>
            <h1 className="text-[23px]">Profile</h1>
            <p className="text-side-text-gray mt-1 pb-4 border-b border-b-nav-search-gray">Customize your profile</p>
            <div className="flex mt-7 flex-col gap-4">
                <div>
                    <p className="mb-2">Username</p>
                    <input type="text" name="change-username" className={`search-bar ${username === "" && "invalid-input"}`} 
                    value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <p className="mb-2">Country</p>
                    <CountriesDropdown country={country} selected={userContext.userData.country} />
                </div>
            </div>
        </div>
    )
}

function Password({ userContext, loading, setLoading }: SectionProps) {
    return (
        <div>
            <h1 className="text-[23px]">Password</h1>
            <p className="text-side-text-gray mt-1 pb-4 border-b border-b-nav-search-gray">Please enter your current password to change your password</p>
            <div className="flex mt-7 flex-col gap-4">
                <div>
                    <p className="mb-2">Current password</p>
                    <input type="text" className="search-bar" placeholder="Enter your current password" />
                </div>
                <div>
                    <p className="mb-2">New password</p>
                    <input type="text" className="search-bar" placeholder="Enter your new password" />
                </div>
                <div>
                    <p className="mb-2">Confirm new password</p>
                    <input type="text" className="search-bar" placeholder="Re-enter your new password" />
                </div>
                <button className="main-btn mt-3">Set Password</button>
            </div>
        </div>
    )
}

export default Settings;