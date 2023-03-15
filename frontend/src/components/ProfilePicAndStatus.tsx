import BlankProfile from '../assets/blank.jpg';
import EditIcon from '../assets/edit.png';
import { useRef, useContext, useState } from 'react';
import { IUserContext, UserContext } from '../context/UserContext';
import { fetchUpdatedUser } from '../utils/fetchUpdatedUser';
import { UpdateResponse } from '../utils/fetchUpdatedUser';
import OutsideClickHandler from 'react-outside-click-handler';

interface ProfilePicAndStatusProps {
    profilePicURL: string, 
    profileStatus: string,
    statusStyles?: string,
    imgStyles?: string,
    showEdit?: boolean,
    setErrorMessage?: React.Dispatch<React.SetStateAction<string>>
}

function ProfilePicAndStatus({ profilePicURL, profileStatus, statusStyles, imgStyles, showEdit, setErrorMessage }: ProfilePicAndStatusProps) {
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

        const updated: Promise<UpdateResponse> = fetchUpdatedUser(userContext.userData.username, {...userContext.userData}, profile);
        updated.then((response) => {
            if (response.status === 200 && response.userData) {
                userContext.setUserData(response.userData);
            } else {
                setErrorMessage(response.message);
            }
        }).catch((err) => {
            setErrorMessage(err.message);
        });
    }

    function removePhoto(): void {
        updatePhoto("");
    }

    async function uploadPhoto(): Promise<void> {
        const base64Str = await new Promise((resolve, _) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(inputFileRef!.current!.files![0]);
        });

        updatePhoto(base64Str);
    }

    return (
        <>
            <div className={profileStatus === 'ONLINE' ? `before:w-4 before:h-4 before:bg-green-500 before:absolute before:top-[33px] 
            before:left-[3px] before:border-2 before:border-main-white before:content[''] before:rounded-full ${statusStyles}`
            : `before:w-4 before:h-4 before:bg-[#FF9800] before:absolute before:top-[33px] before:left-[3px] before:border-2 
            before:border-main-white before:content[''] before:rounded-full ${statusStyles}`}>
                <img src={profilePicURL === "" ? BlankProfile : profilePicURL} alt="profile pic" 
                className={`w-12 h-12 rounded-full border-2 border-main-black ${imgStyles}`} />
                {showEdit &&
                    <>
                        <button className="flex gap-1 items-center absolute text-xs top-[60px] right-0 bg-main-black hover:bg-main-black-hover btn-primary p-1 px-2 h-fit cursor-pointer"
                        onClick={() => setProfileDropdown(true)}>
                            <img src={EditIcon} alt="edit" className="w-4 h-4" />
                            <p className="text-main-white">Edit</p>
                        </button>
                        {profileDropdown && <OutsideClickHandler onOutsideClick={() => setProfileDropdown(false)}>
                            <div className="absolute bg-main-black right-0 mt-2 flex flex-col rounded-[8px] overflow-hidden">
                                <p className="text-main-white text-xs whitespace-nowrap cursor-pointer hover:bg-main-black-hover 
                                profile-menu-element pt-2 pb-2" onClick={triggerUpload}>
                                    Upload a photo...
                                </p>
                                <p className="text-main-white text-xs whitespace-nowrap cursor-pointer hover:bg-main-black-hover 
                                profile-menu-element pb-2 pt-2 border-t border-t-[#3E3E3E]" onClick={removePhoto}>
                                    Remove photo
                                </p>
                                <input type='file' id='file' ref={inputFileRef} className="hidden" onChange={uploadPhoto} />
                            </div>
                        </OutsideClickHandler>}
                    </>}
            </div>
        </>
    );
}

export default ProfilePicAndStatus;