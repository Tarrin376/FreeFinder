import PopUpWrapper from "../../wrappers/PopUpWrapper";
import ProfilePicAndStatus from "../../components/ProfilePicAndStatus";
import { useState, useContext, useReducer } from 'react';
import ErrorMessage from "../../components/ErrorMessage";
import MyDetails from "./MyDetails";
import UserProfile from "./UserProfile";
import ChangePassword from "./ChangePassword";
import DangerZone from "./DangerZone";
import { UserContext } from "../../providers/UserProvider";
import ChangeProfilePicture from "../../components/ChangeProfilePicture";
import KeyPair from "src/components/KeyPair";
import { AccountSections } from "src/enums/AccountSections";

interface SettingsProps {
    setSettingsPopUp: React.Dispatch<React.SetStateAction<boolean>>,
}

export type AccountSettingsState = {
    option: AccountSections,
    loading: boolean,
    profileDropdown: boolean
}

const INITIAL_STATE: AccountSettingsState = {
    option: AccountSections.details,
    loading: false,
    profileDropdown: false
}

function AccountSettings({ setSettingsPopUp }: SettingsProps) {
    const [errorMessage, setErrorMessage] = useState<string>("");
    const userContext = useContext(UserContext);

    const [state, dispatch] = useReducer((state: AccountSettingsState, payload: Partial<AccountSettingsState>) => {
        return { ...state, ...payload };
    }, INITIAL_STATE);

    function updateOption(next: AccountSections): void {
        dispatch({ option: next });
    }

    function getOption(): React.ReactElement<any> {
        switch (state.option) {
            case AccountSections.details:
                return <MyDetails />
            case AccountSections.profile:
                return <UserProfile />
            case AccountSections.password:
                return <ChangePassword />
            default:
                return <DangerZone setSettingsPopUp={setSettingsPopUp} />
        }
    }

    return (
        <PopUpWrapper setIsOpen={setSettingsPopUp} title="Account Settings">
            <div>
                {errorMessage !== "" && 
                <ErrorMessage 
                    message={errorMessage} 
                    title="Unable to upload image"
                    setErrorMessage={setErrorMessage}
                />}
                <div className="flex gap-5 items-center">
                    <div className="relative w-fit h-fit">
                        <ProfilePicAndStatus 
                            profilePicURL={userContext.userData.profilePicURL} 
                            username={userContext.userData.username}
                            setErrorMessage={setErrorMessage} 
                            loading={state.loading} 
                            size={80}
                        />
                        {!state.loading &&
                        <ChangeProfilePicture
                            loading={state.loading}
                            updateLoading={(loading) => dispatch({ loading: loading })}
                        />}
                    </div>
                    <div className="overflow-hidden">
                        <KeyPair
                            itemKey="Username"
                            itemValue={userContext.userData.username}
                            textSize={15}
                        />
                        <KeyPair
                            itemKey="Country"
                            itemValue={userContext.userData.country}
                            textSize={15}
                        />
                        <KeyPair
                            itemKey="Email"
                            itemValue={userContext.userData.email}
                            textSize={15}
                        />
                    </div>
                </div>
                <div className="mt-8 mb-5">
                    <ul className="border-b border-b-nav-search-gray flex justify-between mt-5 list-none">
                        <li className={state.option === AccountSections.details ? "settings-selection" : "settings-unselected"}
                        onClick={() => updateOption(AccountSections.details)}>
                            My details
                        </li>
                        <li className={state.option === AccountSections.profile ? "settings-selection" : "settings-unselected"}
                        onClick={() => updateOption(AccountSections.profile)}>
                            Profile
                        </li>
                        <li className={state.option === AccountSections.password ? "settings-selection" : "settings-unselected"}
                        onClick={() => updateOption(AccountSections.password)}>
                            Password
                        </li>
                        <li className={state.option === AccountSections.dangerZone ? "settings-selection" : "settings-unselected"}
                        onClick={() => updateOption(AccountSections.dangerZone)}>
                            Danger Zone
                        </li>
                    </ul>
                </div>
                {getOption()}
            </div>
        </PopUpWrapper>
    );
}

export default AccountSettings;