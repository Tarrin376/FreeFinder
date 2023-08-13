import EditIcon from "../assets/edit.png";
import { useRef, useState, useContext } from "react";
import { checkImageType } from "../utils/checkImageType";
import { UserContext } from "../providers/UserProvider";
import ErrorPopUp from "./ErrorPopUp";
import { AnimatePresence } from "framer-motion";
import { MAX_PROFILE_PIC_BYTES } from "@freefinder/shared/dist/constants";
import { fetchUpdatedUser } from "src/utils/fetchUpdatedUser";
import { getAPIErrorMessage } from "src/utils/getAPIErrorMessage";
import { AxiosError } from "axios";
import { compressImage } from "src/utils/compressImage";
import Dropdown from "./Dropdown";

interface ChangeProfilePictureProps {
    loading: boolean,
    updateLoading: (loading: boolean) => void
}

function ChangeProfilePicture({ loading, updateLoading }: ChangeProfilePictureProps) {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [profileDropdown, setProfileDropdown] = useState<boolean>(false);
    const userContext = useContext(UserContext);

    function removePhoto(): void {
        if (loading || userContext.userData.profilePicURL === "") {
            return;
        }

        updateLoading(true);
        updateProfilePic("");
    }

    async function updateProfilePic(profilePic: string | unknown): Promise<void> {
        if (!setErrorMessage || loading) {
            return;
        }

        try {
            const response = await fetchUpdatedUser({}, userContext.userData.username, profilePic);
            userContext.setUserData(response.userData);
            setErrorMessage("");
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            setErrorMessage(errorMessage);
        }
        finally {
            updateLoading(false);
        }
    }

    async function uploadProfilePic(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
        const files = e.target.files;
        if (!files || loading || !setErrorMessage) {
            return;
        }

        updateLoading(true);
        const profilePic = files[0];
        const valid = checkImageType(profilePic, MAX_PROFILE_PIC_BYTES);

        if (valid) {
            try {
                const compressedImage = await compressImage(profilePic);
                updateProfilePic(compressedImage);
            }
            catch (_: any) {
                setErrorMessage("Something went wrong. Please try again later.");
                updateLoading(false);
            }
        } else {
            setErrorMessage(`Failed to upload profile picture. Please check that the file format is
            supported and the image does not exceed ${MAX_PROFILE_PIC_BYTES / 1000000}MB in size.`);
            updateLoading(false);
        }
    }

    function triggerUpload(): void {
        if (inputFileRef.current) {
            inputFileRef.current.click();
        }
    }

    function toggleProfileDropdown(): void {
        setProfileDropdown((cur) => !cur);
    }

    return (
        <div className="w-fit absolute bottom-[-12px] right-0">
            <AnimatePresence>
                {errorMessage !== "" && 
                <ErrorPopUp 
                    errorMessage={errorMessage} 
                    setErrorMessage={setErrorMessage}
                />}
            </AnimatePresence>
            <div className="relative">
                <button className="flex gap-1 items-center bg-main-white 
                hover:bg-main-white-hover border border-light-border-gray btn-primary py-[3px] px-2 h-fit 
                cursor-pointer rounded-[6px]" onClick={toggleProfileDropdown}>
                    <img src={EditIcon} alt="edit" className="w-4 h-4" />
                    <p className="text-main-black text-[13px]">Edit</p>
                </button>
                <input type="file" ref={inputFileRef} className="hidden" onChange={uploadProfilePic} />
                <AnimatePresence>
                    {profileDropdown &&
                    <Dropdown
                        toggleDropdown={toggleProfileDropdown}
                        textStyles="!text-[13px]"
                        styles="!left-0 !top-full mt-[5px] w-fit"
                        items={[
                            [`Upload (max ${MAX_PROFILE_PIC_BYTES / 1000000}MB)`, triggerUpload],
                            ["Remove", removePhoto]
                        ]}
                    />}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default ChangeProfilePicture;