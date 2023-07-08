import ProfilePicAndStatus from "./ProfilePicAndStatus";
import { initialState } from "../providers/UserContext";
import { useState, useContext } from 'react';
import { fetchUpdatedUser } from "../utils/fetchUpdatedUser";
import OutsideClickHandler from "react-outside-click-handler";
import axios from "axios";
import NotificationIcon from "../assets/notification.png";
import { UserContext } from "../providers/UserContext";
import { UserStatus } from "../enums/UserStatus";
import { useNavigate } from "react-router-dom";

interface ProfileMenuProps {
    setSettingsPopUp: React.Dispatch<React.SetStateAction<boolean>>,
    setSellerProfilePopUp: React.Dispatch<React.SetStateAction<boolean>>
}

function ProfileMenu({ setSettingsPopUp, setSellerProfilePopUp }: ProfileMenuProps) {
    const [disabled, setDisabled] = useState<boolean>(false);
    const [navProfileDropdown, setNavProfileDropdown] = useState<boolean>(false);
    const userContext = useContext(UserContext);
    const navigate = useNavigate();

    async function toggleStatus(): Promise<void> {
        const toggledStatus: string = userContext.userData.status === UserStatus.ONLINE ? UserStatus.OFFLINE : UserStatus.ONLINE;
        setDisabled(true);

        try {
            const response = await fetchUpdatedUser({
                ...userContext.userData, 
                status: toggledStatus
            }, userContext.userData.username);
    
            userContext.setUserData(response.userData);
        } 
        catch (err: any) {
            // Ignore error message and do nothing
        } 
        finally {
            setDisabled(false);
        }
    }

    async function logout(): Promise<void> {
        try {
            await axios.delete<{ message: string }>(`/api/users/session`);
            userContext.setUserData(initialState.userData);
        }
        catch (err: any) {
            // Ignore error message and do nothing if session is invalid or expired.
        }
    }

    function openSettings(): void {
        setNavProfileDropdown(false);
        setSettingsPopUp(true);
    }

    function openSellerProfile(): void {
        setNavProfileDropdown(false);
        setSellerProfilePopUp(true);
    }

    function viewProfile(): void {
        navigate(`/sellers/${userContext.userData.username}`);
        setNavProfileDropdown(false);
    }

    return (
        <div className="flex gap-7 items-center">
            <div className="flex gap-3 items-center cursor-pointer">
                <div className="relative">
                    <img src={NotificationIcon} className="w-[30px] h-[30px]" alt="notifications" />
                    <span className="absolute top-0 right-[1px] flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error-text opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-error-text"></span>
                    </span>
                </div>
            </div>
            <div className="cursor-pointer relative">
                <div onClick={() => setNavProfileDropdown(true)}>
                    <ProfilePicAndStatus 
                        profilePicURL={userContext.userData.profilePicURL} 
                        profileStatus={userContext.userData.status} 
                    />
                </div>
                <OutsideClickHandler onOutsideClick={() => setNavProfileDropdown(false)}>
                    {navProfileDropdown && 
                    <ul className="absolute bg-main-white shadow-profile-page-container 
                    mt-2 border-light-gray border-2 rounded-[11px] right-0 z-10 overflow-hidden">
                        <div className="border-b border-light-gray">
                            <p className="whitespace-nowrap p-3 pt-1 pb-1 cursor-default profile-menu-element hover:!bg-main-white">
                                Signed in as: <span className="text-main-blue text-[15px]">{userContext.userData.username}</span>
                            </p>
                        </div>
                        <div className="border-b border-light-gray flex flex-col">
                            {userContext.userData.seller &&
                            <p className="profile-menu-element" onClick={viewProfile}>
                                View profile
                            </p>}
                            <p className="profile-menu-element" onClick={openSettings}>
                                Account settings
                            </p>
                            {userContext.userData.seller && 
                            <p className="profile-menu-element" onClick={openSellerProfile}>
                                Update seller profile
                            </p>}
                            <button className="profile-menu-element" onClick={toggleStatus} disabled={disabled}>
                                Appear {userContext.userData.status === UserStatus.ONLINE ? 'offline': 'online'}
                            </button>
                        </div>
                        <div className="flex flex-col">
                            <p className="profile-menu-element rounded-bl-[11px] rounded-br-[11px]" onClick={logout}>
                                Log out
                            </p>
                        </div>
                    </ul>}
                </OutsideClickHandler>
            </div>
        </div>
    )
}

export default ProfileMenu;