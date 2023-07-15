import EditIcon from '../assets/edit.png';
import { useRef, useContext, useState } from 'react';
import { IUserContext, UserContext } from '../providers/UserContext';
import { fetchUpdatedUser } from '../utils/fetchUpdatedUser';
import OutsideClickHandler from 'react-outside-click-handler';
import { parseImage } from '../utils/parseImage';
import { getAPIErrorMessage } from '../utils/getAPIErrorMessage';
import { AxiosError } from "axios";
import { UserStatus } from '../enums/UserStatus';
import { checkFile } from '../utils/checkFile';
import { generateLetterAvatar } from '../utils/generateLetterAvatar';

interface ProfilePicAndStatusProps {
    profilePicURL: string, 
    profileStatus: string,
    size: number,
    username: string,
    statusStyles?: string,
    imgStyles?: string,
    showEdit?: boolean,
    setErrorMessage?: React.Dispatch<React.SetStateAction<string>>,
    loading?: boolean,
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>,
    action?: () => void,
}

const MAX_PROFILE_PIC_BYTES = 1000000;

function ProfilePicAndStatus(props: ProfilePicAndStatusProps) {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const userContext: IUserContext = useContext(UserContext);
    const [profileDropdown, setProfileDropdown] = useState<boolean>(false);

    function triggerUpload(): void {
        if (inputFileRef.current) {
            inputFileRef.current.click();
        }
    }

    async function updatePhoto(profile: string | unknown): Promise<void> {
        if (!props.setErrorMessage || !props.setLoading) {
            return;
        }

        try {
            const response = await fetchUpdatedUser({...userContext.userData}, userContext.userData.username, profile);
            userContext.setUserData(response.userData);
            props.setErrorMessage("");
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            props.setErrorMessage(errorMessage);
        }
        finally {
            props.setLoading(false);
        }
    }

    function removePhoto(): void {
        if (!props.setLoading || userContext.userData.profilePicURL === "") {
            return;
        }

        props.setLoading(true);
        updatePhoto("");
    }

    async function uploadPhoto(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
        const files = e.target.files;
        if (!files || !props.setLoading || !props.setErrorMessage) {
            return;
        }

        props.setLoading(true);
        const profilePic = files[0];
        const valid = checkFile(profilePic, MAX_PROFILE_PIC_BYTES);

        if (valid) {
            const base64Str = await parseImage(profilePic);
            updatePhoto(base64Str);
        } else {
            props.setErrorMessage(`Failed to upload profile picture. Please check that the file format is
            supported and the image does not exceed ${MAX_PROFILE_PIC_BYTES / 1000000}MB in size.`);
            props.setLoading(false);
        }
    }

    function handleAction(): void {
        if (props.action) {
            props.action();
        }
    }

    return (
        <div className={props.loading || props.showEdit ? '' : `${props.profileStatus === UserStatus.ONLINE ? 'before:bg-green-500' : 
        props.profileStatus === 'AWAY' ? 'before:bg-orange-400' : 'before:bg-side-text-gray'} 
        before:w-[18px] before:h-[18px] before:absolute before:top-[33px] before:left-[0px] 
        before:border-[3px] before:border-main-white before:content[''] 
        before:rounded-full ${props.statusStyles}`}
        onClick={handleAction}>
            {props.loading ? 
            <div className={`rounded-full loading ${props.imgStyles}`} 
            style={{ width: `${props.size}px`, height: `${props.size}px` }}>
            </div> : 
            props.profilePicURL === "" ? 
            <div className={`flex items-center justify-center rounded-full ${props.imgStyles}`} style={{ 
                backgroundColor: generateLetterAvatar(props.username),
                width: `${props.size}px`, 
                height: `${props.size}px` 
            }}>
                <p className="text-main-white" style={{ fontSize: `${props.size * 0.50}px` }}>
                    {props.username[0].toUpperCase()}
                </p>
            </div> :
            <img 
                src={props.profilePicURL} alt="" 
                className={`rounded-full object-cover ${props.imgStyles} 
                border border-b-nav-search-gray`}
                style={{ width: `${props.size}px`, height: `${props.size}px` }}
            />}
            {props.showEdit && !props.loading &&
                <>
                    <button className="flex gap-1 items-center absolute top-[62px] right-0 bg-main-white 
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
                                onChange={uploadPhoto} 
                            />
                        </div>
                    </OutsideClickHandler>}
                </>}
        </div>
    );
}

export default ProfilePicAndStatus;