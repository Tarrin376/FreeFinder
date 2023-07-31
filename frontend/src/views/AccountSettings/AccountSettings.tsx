import PopUpWrapper from "../../wrappers/PopUpWrapper";
import ProfilePicAndStatus from "../../components/ProfilePicAndStatus";
import { useState, useContext, useReducer } from 'react';
import ErrorMessage from "../../components/ErrorMessage";
import MyDetails from "./MyDetails";
import UserProfile from "./UserProfile";
import ChangePassword from "./ChangePassword";
import DangerZone from "./DangerZone";
import { UserContext } from "../../providers/UserContext";
import { fetchUpdatedUser } from "../../utils/fetchUpdatedUser";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";
import { AxiosError } from "axios";
import ChangeProfilePicture from "../../components/ChangeProfilePicture";

interface SettingsProps {
    setSettingsPopUp: React.Dispatch<React.SetStateAction<boolean>>,
}

enum Options {
    details,
    profile,
    password,
    dangerZone
}

export type AccountSettingsState = {
    option: Options,
    loading: boolean,
    profileDropdown: boolean
}

const initialState: AccountSettingsState = {
    option: Options.details,
    loading: false,
    profileDropdown: false
}

export const MAX_PROFILE_PIC_BYTES = 1000000;

function AccountSettings({ setSettingsPopUp }: SettingsProps) {
    const [errorMessage, setErrorMessage] = useState<string>("");
    const userContext = useContext(UserContext);

    const [state, dispatch] = useReducer((state: AccountSettingsState, payload: Partial<AccountSettingsState>) => {
        return { ...state, ...payload };
    }, initialState);

    function updateOption(next: Options): void {
        dispatch({ option: next });
    }

    function getOption(): React.ReactElement<any> {
        switch (state.option) {
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

    async function updatePhoto(profile: string | unknown): Promise<void> {
        if (!setErrorMessage || state.loading) {
            return;
        }

        try {
            const response = await fetchUpdatedUser({ ...userContext.userData }, userContext.userData.username, profile);
            userContext.setUserData(response.userData);
            setErrorMessage("");
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            setErrorMessage(errorMessage);
        }
        finally {
            dispatch({ loading: false });
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
                <div className="relative w-fit h-fit">
                    <ProfilePicAndStatus 
                        profilePicURL={userContext.userData.profilePicURL} 
                        profileStatus={userContext.userData.status} 
                        statusStyles="before:hidden"
                        username={userContext.userData.username}
                        setErrorMessage={setErrorMessage} 
                        loading={state.loading} 
                        size={80}
                    />
                    {!state.loading &&
                    <ChangeProfilePicture
                        updatePhoto={updatePhoto}
                        loading={state.loading}
                        dispatch={dispatch}
                    />}
                </div>
                <div>
                    <p>Username: <span className="text-main-blue">{userContext.userData.username}</span></p>
                    <p>Country: <span className="text-main-blue">{userContext.userData.country}</span></p>
                    <p>Email: <span className="text-main-blue">{userContext.userData.email}</span></p>
                </div>
            </div>
            <div className="mt-9 mb-5">
                <ul className="border-b border-b-nav-search-gray flex justify-between mt-5 list-none">
                    <li className={state.option === Options.details ? "settings-selection" : "settings-unselected"}
                    onClick={() => updateOption(Options.details)}>My details</li>
                    <li className={state.option === Options.profile ? "settings-selection" : "settings-unselected"}
                    onClick={() => updateOption(Options.profile)}>Profile</li>
                    <li className={state.option === Options.password ? "settings-selection" : "settings-unselected"}
                    onClick={() => updateOption(Options.password)}>Password</li>
                    <li className={state.option === Options.dangerZone ? "settings-selection" : "settings-unselected"}
                    onClick={() => updateOption(Options.dangerZone)}>Danger Zone</li>
                </ul>
            </div>
            {getOption()}
        </PopUpWrapper>
    );
}

export default AccountSettings;