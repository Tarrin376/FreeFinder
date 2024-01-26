import PopUpWrapper from "../../wrappers/PopUpWrapper";
import ProfilePicAndStatus from "../../components/Profile/ProfilePicAndStatus";
import { useState, useContext, useReducer } from 'react';
import ErrorMessage from "../../components/Error/ErrorMessage";
import MyDetails from "./MyDetails";
import UserProfile from "./UserProfile";
import ChangePassword from "./ChangePassword";
import DangerZone from "./DangerZone";
import { UserContext } from "../../providers/UserProvider";
import ChangeProfilePicture from "../../components/Profile/ChangeProfilePicture";
import KeyPair from "src/components/KeyPair";
import { AccountSections } from "src/enums/AccountSections";
import Selection from "src/components/Selection";
import { useWindowSize } from "src/hooks/useWindowSize";
import { ClientOrdersSections } from "src/enums/ClientOrdersSections";

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
    const windowSize = useWindowSize();

    const [state, dispatch] = useReducer((state: AccountSettingsState, payload: Partial<AccountSettingsState>) => {
        return { ...state, ...payload };
    }, INITIAL_STATE);

    function updateOption(next: AccountSections | ClientOrdersSections): void {
        dispatch({ option: next as AccountSections });
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
                            size={windowSize >= 450 ? 80 : 70}
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
                    <ul className="border-b border-b-nav-search-gray flex justify-between gap-6 mt-5 list-none overflow-x-scroll">
                        <Selection<AccountSections>
                            currentOption={state.option}
                            option={AccountSections.details}
                            updateOption={updateOption}
                            text="My details"
                        />
                        <Selection<AccountSections>
                            currentOption={state.option}
                            option={AccountSections.profile}
                            updateOption={updateOption}
                            text="Profile"
                        />
                        <Selection<AccountSections>
                            currentOption={state.option}
                            option={AccountSections.password}
                            updateOption={updateOption}
                            text="Password"
                        />
                        <Selection<AccountSections>
                            currentOption={state.option}
                            option={AccountSections.dangerZone}
                            updateOption={updateOption}
                            text="Danger Zone"
                        />
                    </ul>
                </div>
                {getOption()}
            </div>
        </PopUpWrapper>
    );
}

export default AccountSettings;