import BlankProfile from '../assets/blank.jpg';
import EditIcon from '../assets/edit.png';
import { useRef, useContext, useState } from 'react';
import { IUserContext, UserContext } from '../context/UserContext';
import { fetchUpdatedUser } from '../utils/fetchUpdatedUser';
import OutsideClickHandler from 'react-outside-click-handler';
import { parseImage } from '../utils/parseImage';
import { getAPIErrorMessage } from '../utils/getAPIErrorMessage';
import { AxiosError } from "axios";

interface ProfilePicAndStatusProps {
    profilePicURL: string, 
    profileStatus: string,
    statusStyles?: string,
    imgStyles?: string,
    showEdit?: boolean,
    setErrorMessage?: React.Dispatch<React.SetStateAction<string>>,
    loading?: boolean,
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>
}

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
            const response = await fetchUpdatedUser({...userContext.userData}, profile);
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
        if (props.setLoading) {
            props.setLoading(true);
        }
        
        updatePhoto("");
    }

    async function uploadPhoto(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
        const files = e.target.files;
        if (!files || !props.setLoading || !props.setErrorMessage) {
            return;
        }

        props.setLoading(true);
        const profilePic = files[0];

        if (profilePic.type === "image/gif" || profilePic.type === "image/jpeg" || profilePic.type === "image/png") {
            const base64Str = await parseImage(files[0]);
            updatePhoto(base64Str);
        } else {
            props.setErrorMessage(`Image format '${profilePic.type}' is not supported.`);
            props.setLoading(false);
        }
    }

    return (
        <div className={props.loading ? '' : `${props.profileStatus === 'ONLINE' ? 'before:bg-green-500' : 'before:bg-side-text-gray'} 
        before:w-[18px] before:h-[18px] before:absolute before:top-[33px] before:left-[0px] before:border-[3px] before:border-main-white 
        before:content[''] before:rounded-full ${props.statusStyles}`}>
            {props.loading ? 
            <div className={`w-12 h-12 rounded-full loading ${props.imgStyles}`}>
            </div> : 
            <img 
                src={props.profilePicURL === "" ? BlankProfile : props.profilePicURL} 
                alt="" 
                className={`w-12 h-12 rounded-full object-cover ${props.imgStyles} border border-b-nav-search-gray`} 
            />}
            {props.showEdit && !props.loading &&
                <>
                    <button className="flex gap-1 items-center absolute text-xs top-[60px] right-0 bg-main-white hover:bg-main-white-hover border-2 border-light-gray 
                    btn-primary p-1 px-2 h-fit cursor-pointer"
                    onClick={() => setProfileDropdown(true)}>
                        <img src={EditIcon} alt="edit" className="w-4 h-4" />
                        <p className="text-main-black">Edit</p>
                    </button>
                    {profileDropdown && 
                    <OutsideClickHandler onOutsideClick={() => setProfileDropdown(false)}>
                        <div className="absolute bg-main-white right-0 mt-3 flex flex-col rounded-[8px] overflow-hidden border-2 border-light-gray 
                        shadow-profile-page-container">
                            <p className="text-xs cursor-pointer hover:bg-main-white-hover 
                            profile-menu-element pt-[6px] pb-[6px]" onClick={triggerUpload}>
                                Upload photo...
                            </p>
                            <p className="text-xs cursor-pointer hover:bg-main-white-hover 
                            profile-menu-element pt-[6px] pb-[6px] border-t border-t-light-gray" onClick={removePhoto}>
                                Remove photo
                            </p>
                            <input type='file' ref={inputFileRef} className="hidden" onChange={uploadPhoto} />
                        </div>
                    </OutsideClickHandler>}
                </>}
        </div>
    );
}

export default ProfilePicAndStatus;