import { IUserContext } from "../../context/UserContext";
import PopUpWrapper from "../../layouts/PopUpWrapper";
import ProfilePicAndStatus from "../../components/ProfilePicAndStatus";
import { useState } from 'react';
import ErrorMessage from "../../components/ErrorMessage";
import MyDetails from "./MyDetails";
import UserProfile from "./UserProfile";
import ChangePassword from "./ChangePassword";
import DangerZone from "./DangerZone";

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

function AccountSettings({ setSettingsPopUp, userContext }: SettingsProps) {
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [option, setOption] = useState<Options>(Options.details);
    const [loading, setLoading] = useState<boolean>(false);

    function updateOption(next: Options): void {
        setOption(next);
    }

    return (
        <PopUpWrapper setIsOpen={setSettingsPopUp} title={"Account Settings"}>
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
            {option === Options.profile && <UserProfile userContext={userContext} />}
            {option === Options.password && <ChangePassword userContext={userContext} />}
            {option === Options.dangerZone && <DangerZone userContext={userContext} setSettingsPopUp={setSettingsPopUp} />}
        </PopUpWrapper>
    );
}

export default AccountSettings;