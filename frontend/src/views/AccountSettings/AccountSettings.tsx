import PopUpWrapper from "../../wrappers/PopUpWrapper";
import ProfilePicAndStatus from "../../components/ProfilePicAndStatus";
import { useState, useContext, useRef, useReducer } from 'react';
import ErrorMessage from "../../components/ErrorMessage";
import MyDetails from "./MyDetails";
import UserProfile from "./UserProfile";
import ChangePassword from "./ChangePassword";
import DangerZone from "./DangerZone";
import { UserContext } from "../../providers/UserContext";
import EditIcon from '../../assets/edit.png';
import { parseFileBase64 } from "../../utils/parseFileBase64";
import { fetchUpdatedUser } from "../../utils/fetchUpdatedUser";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";
import { AxiosError } from "axios";
import { checkImageType } from "../../utils/checkImageType";
import OutsideClickHandler from "react-outside-click-handler";

interface SettingsProps {
    setSettingsPopUp: React.Dispatch<React.SetStateAction<boolean>>,
}

enum Options {
    details,
    profile,
    password,
    dangerZone
}

type AccountSettingsState = {
    option: Options,
    loading: boolean,
    profileDropdown: boolean
}

const initialState: AccountSettingsState = {
    option: Options.details,
    loading: false,
    profileDropdown: false
}

const MAX_PROFILE_PIC_BYTES = 1000000;

function AccountSettings({ setSettingsPopUp }: SettingsProps) {
    const [errorMessage, setErrorMessage] = useState<string>("");
    const userContext = useContext(UserContext);
    const inputFileRef = useRef<HTMLInputElement>(null);

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

    function triggerUpload(): void {
        if (inputFileRef.current) {
            inputFileRef.current.click();
        }
    }

    async function updatePhoto(profile: string | unknown): Promise<void> {
        if (!setErrorMessage || state.loading) {
            return;
        }

        try {
            const response = await fetchUpdatedUser({...userContext.userData}, userContext.userData.username, profile);
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

    function removePhoto(): void {
        if (state.loading || userContext.userData.profilePicURL === "") {
            return;
        }

        dispatch({ loading: true });
        updatePhoto("");
    }

    async function uploadPhoto(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
        const files = e.target.files;
        if (!files || state.loading || !setErrorMessage) {
            return;
        }

        dispatch({ loading: true });
        const profilePic = files[0];
        const valid = checkImageType(profilePic, MAX_PROFILE_PIC_BYTES);

        if (valid) {
            try {
                const base64Str = await parseFileBase64(profilePic);
                updatePhoto(base64Str);
            }
            catch (err: any) {
                setErrorMessage("Something went wrong. Please try again.");
                dispatch({ loading: false });
            }
        } else {
            setErrorMessage(`Failed to upload profile picture. Please check that the file format is
            supported and the image does not exceed ${MAX_PROFILE_PIC_BYTES / 1000000}MB in size.`);
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
                    <>
                        <button className="flex gap-1 items-center absolute top-[62px] right-0 bg-main-white 
                      hover:bg-main-white-hover border border-light-border-gray btn-primary py-[3px] px-2 h-fit 
                        cursor-pointer rounded-[6px]" onClick={() => dispatch({ profileDropdown: true })}>
                            <img src={EditIcon} alt="edit" className="w-4 h-4" />
                            <p className="text-main-black text-[13px]">Edit</p>
                        </button>
                        {state.profileDropdown && 
                        <OutsideClickHandler onOutsideClick={() => dispatch({ profileDropdown: false })}>
                            <div className="absolute bg-main-white left-[20px] mt-[17px] flex flex-col rounded-[6px] 
                            border border-light-border-gray shadow-profile-page-container overflow-hidden">
                                <p className="text-[13px] cursor-pointer hover:bg-main-white-hover 
                                profile-menu-element pt-[6px] pb-[6px]" onClick={triggerUpload}>
                                    {`Upload (max ${MAX_PROFILE_PIC_BYTES / 1000000}MB)`}
                                </p>
                                <p className="text-[13px] cursor-pointer hover:bg-main-white-hover 
                                profile-menu-element pt-[6px] pb-[6px] border-t border-t-light-border-gray"
                                onClick={removePhoto}>
                                    Remove
                                </p>
                                <input 
                                    type='file' 
                                    ref={inputFileRef} 
                                    className="hidden"
                                    onChange={uploadPhoto} 
                                />
                            </div>
                        </OutsideClickHandler>}
                    </>}
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