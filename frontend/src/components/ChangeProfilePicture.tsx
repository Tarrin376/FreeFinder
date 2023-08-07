import OutsideClickHandler from "react-outside-click-handler";
import EditIcon from "../assets/edit.png";
import { useRef, useState, useContext } from "react";
import { parseFileBase64 } from "../utils/parseFileBase64";
import { checkImageType } from "../utils/checkImageType";
import { UserContext } from "../providers/UserContext";
import ErrorPopUp from "./ErrorPopUp";
import { AnimatePresence } from "framer-motion";
import { AccountSettingsState } from "../views/AccountSettings/AccountSettings";
import { MAX_PROFILE_PIC_BYTES } from "@freefinder/shared/dist/constants";
import { fetchUpdatedUser } from "src/utils/fetchUpdatedUser";
import { getAPIErrorMessage } from "src/utils/getAPIErrorMessage";
import { AxiosError } from "axios";

interface ChangeProfilePictureProps {
    loading: boolean,
    dispatch: React.Dispatch<Partial<AccountSettingsState>>
}

function ChangeProfilePicture({ loading, dispatch }: ChangeProfilePictureProps) {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [profileDropdown, setProfileDropdown] = useState<boolean>(false);
    const userContext = useContext(UserContext);

    function removePhoto(): void {
        if (loading || userContext.userData.profilePicURL === "") {
            return;
        }

        dispatch({ loading: true });
        updateProfilePic("");
    }

    async function updateProfilePic(profilePic: string | unknown): Promise<void> {
        if (!setErrorMessage || loading) {
            return;
        }

        try {
            const response = await fetchUpdatedUser({ ...userContext.userData }, userContext.userData.username, profilePic);
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

    async function uploadProfilePic(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
        const files = e.target.files;
        if (!files || loading || !setErrorMessage) {
            return;
        }

        dispatch({ loading: true });
        const profilePic = files[0];
        const valid = checkImageType(profilePic, MAX_PROFILE_PIC_BYTES);

        if (valid) {
            try {
                const base64Str = await parseFileBase64(profilePic);
                updateProfilePic(base64Str);
            }
            catch (err: any) {
                setErrorMessage("Something went wrong. Please try again later.");
                dispatch({ loading: false });
            }
        } else {
            setErrorMessage(`Failed to upload profile picture. Please check that the file format is
            supported and the image does not exceed ${MAX_PROFILE_PIC_BYTES / 1000000}MB in size.`);
            dispatch({ loading: false });
        }
    }

    function triggerUpload(): void {
        if (inputFileRef.current) {
            inputFileRef.current.click();
        }
    }

    return (
        <div className="relative">
            <AnimatePresence>
                {errorMessage !== "" && 
                <ErrorPopUp 
                    errorMessage={errorMessage} 
                    setErrorMessage={setErrorMessage}
                />}
            </AnimatePresence>
            <button className="flex gap-1 items-center absolute top-[-15px] right-0 bg-main-white 
            hover:bg-main-white-hover border border-light-border-gray btn-primary py-[3px] px-2 h-fit 
            cursor-pointer rounded-[6px]" onClick={() => setProfileDropdown(true)}>
                <img src={EditIcon} alt="edit" className="w-4 h-4" />
                <p className="text-main-black text-[13px]">Edit</p>
            </button>
            {profileDropdown && 
            <OutsideClickHandler onOutsideClick={() => setProfileDropdown(false)}>
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
                        onChange={uploadProfilePic} 
                    />
                </div>
            </OutsideClickHandler>}
        </div>
    )
}

export default ChangeProfilePicture;