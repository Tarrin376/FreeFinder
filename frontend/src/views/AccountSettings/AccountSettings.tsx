import PopUpWrapper from "../../wrappers/PopUpWrapper";
import ProfilePicAndStatus from "../../components/ProfilePicAndStatus";
import { useState, useContext } from 'react';
import ErrorMessage from "../../components/ErrorMessage";
import MyDetails from "./MyDetails";
import UserProfile from "./UserProfile";
import ChangePassword from "./ChangePassword";
import DangerZone from "./DangerZone";
import { UserContext } from "../../providers/UserContext";

interface SettingsProps {
    setSettingsPopUp: React.Dispatch<React.SetStateAction<boolean>>,
}

enum Options {
    details,
    profile,
    password,
    dangerZone
}

function AccountSettings({ setSettingsPopUp }: SettingsProps) {
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [option, setOption] = useState<Options>(Options.details);
    const [loading, setLoading] = useState<boolean>(false);
    const userContext = useContext(UserContext);

    function updateOption(next: Options): void {
        setOption(next);
    }

    function getOption(): React.ReactElement<any> {
        switch (option) {
            case Options.details:
                return <MyDetails />
            case Options.profile:
                return <UserProfile />
            case Options.password:
                return <ChangePassword />
            default:
                return <DangerZone setSettingsPopUp={setSettingsPopUp} />
        }
    }

    return (
        <PopUpWrapper setIsOpen={setSettingsPopUp} title="Account Settings">
            {errorMessage !== "" && 
            <ErrorMessage 
                message={errorMessage} 
                title="Unable to upload image"
                setErrorMessage={setErrorMessage}
            />}
            <div className="flex gap-5">
                <div className="relative">
                    <ProfilePicAndStatus 
                        profilePicURL={userContext.userData.profilePicURL} 
                        profileStatus={userContext.userData.status} 
                        statusStyles="before:left-[55px] before:top-[60px] before:w-5 before:h-5"
                        username={userContext.userData.username}
                        setErrorMessage={setErrorMessage} 
                        setLoading={setLoading} 
                        showEdit={true} 
                        loading={loading} 
                        size={80}
                    />
                </div>
                <div>
                    <p>Username: <span className="text-main-blue">{userContext.userData.username}</span></p>
                    <p>Country: <span className="text-main-blue">{userContext.userData.country}</span></p>
                    <p>Email: <span className="text-main-blue">{userContext.userData.email}</span></p>
                </div>
            </div>
            <div className="mt-9 mb-5">
                <ul className="border-b border-b-nav-search-gray flex justify-between mt-5 list-none">
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
            {getOption()}
        </PopUpWrapper>
    );
}

export default AccountSettings;