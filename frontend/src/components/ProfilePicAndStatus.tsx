import BlankProfile from '../assets/blank.jpg';
import EditIcon from '../assets/edit.png';
import { useRef, useContext, useState } from 'react';
import { IUserContext, UserContext } from '../context/UserContext';
import { fetchUpdatedUser } from '../utils/fetchUpdatedUser';
import { UpdateResponse } from '../utils/fetchUpdatedUser';
import OutsideClickHandler from 'react-outside-click-handler';
import { parseImage } from '../utils/parseImage';

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

function ProfilePicAndStatus({ profilePicURL, profileStatus, statusStyles, imgStyles, showEdit,
    setErrorMessage, loading, setLoading }: ProfilePicAndStatusProps) {

    const inputFileRef = useRef<HTMLInputElement>(null);
    const userContext: IUserContext = useContext(UserContext);
    const [profileDropdown, setProfileDropdown] = useState<boolean>(false);

    function triggerUpload() {
        if (inputFileRef.current) {
            inputFileRef.current.click();
        }
    }

    function updatePhoto(profile: string | unknown): void {
        if (!setErrorMessage) {
            return;
        }

        const updated: Promise<UpdateResponse> = fetchUpdatedUser({...userContext.userData}, profile);
        updated.then((response) => {
            if (response.message === "success" && response.userData) {
                userContext.setUserData(response.userData);
                setErrorMessage("");
            } else {
                setErrorMessage(response.message);
            }

            if (setLoading) {
                setLoading(false);
            }
        }).catch((err) => {
            setErrorMessage(err.message);
            if (setLoading) {
                setLoading(false);
            }
        });
    }

    function removePhoto(): void {
        if (setLoading) {
            setLoading(true);
        }
        
        updatePhoto("");
    }

    async function uploadPhoto(file: File): Promise<void> {
        if (setLoading) {
            setLoading(true);
        }
        
        const base64Str = await parseImage(file);
        updatePhoto(base64Str);
    }

    return (
        <div className={loading ? '' : `${profileStatus === 'ONLINE' ? 'before:bg-green-500' : 'before:bg-[#FF9800]'} before:w-[18px] before:h-[18px]
        before:absolute before:top-[33px] before:left-[0px] before:border-[3px] before:border-main-white before:content[''] before:rounded-full ${statusStyles}`}>
            {loading ? <div className={`w-12 h-12 rounded-full loading ${imgStyles}`}></div> : 
            <img src={profilePicURL === "" ? BlankProfile : profilePicURL} alt="profile pic" 
            className={`w-12 h-12 rounded-full object-cover ${imgStyles} border border-b-nav-search-gray`} />}
            {showEdit && !loading &&
                <>
                    <button className="flex gap-1 items-center absolute text-xs top-[60px] right-0 bg-main-black hover:bg-main-black-hover btn-primary p-1 px-2 h-fit cursor-pointer"
                    onClick={() => setProfileDropdown(true)}>
                        <img src={EditIcon} alt="edit" className="w-4 h-4" />
                        <p className="text-main-white">Edit</p>
                    </button>
                    {profileDropdown && 
                    <OutsideClickHandler onOutsideClick={() => setProfileDropdown(false)}>
                        <div className="absolute bg-main-black right-0 mt-2 flex flex-col rounded-[8px] overflow-hidden">
                            <p className="text-main-white text-xs whitespace-nowrap cursor-pointer hover:bg-main-black-hover 
                            profile-menu-element pt-2 pb-2" onClick={triggerUpload}>
                                Upload a photo...
                            </p>
                            <p className="text-main-white text-xs whitespace-nowrap cursor-pointer hover:bg-main-black-hover 
                            profile-menu-element pb-2 pt-2 border-t border-t-[#3E3E3E]" onClick={removePhoto}>
                                Remove photo
                            </p>
                            <input type='file' ref={inputFileRef} className="hidden" onChange={() => uploadPhoto(inputFileRef!.current!.files![0])} />
                        </div>
                    </OutsideClickHandler>}
                </>}
        </div>
    );
}

export default ProfilePicAndStatus;