import ProfilePicAndStatus from "./ProfilePicAndStatus";
import { IUserContext } from "../context/UserContext";
import { initialState } from "../context/UserContext";
import { useState } from 'react';
import { fetchUpdatedUser } from "../utils/fetchUpdatedUser";
import OutsideClickHandler from "react-outside-click-handler";
import axios from "axios";

interface ProfileMenuProps {
    userContext: IUserContext,
    setSettingsPopUp: React.Dispatch<React.SetStateAction<boolean>>,
    setSellerProfilePopUp: React.Dispatch<React.SetStateAction<boolean>>
}

function ProfileMenu({ userContext, setSettingsPopUp, setSellerProfilePopUp }: ProfileMenuProps) {
    const [disabled, setDisabled] = useState<boolean>(false);
    const [navProfileDropdown, setNavProfileDropdown] = useState<boolean>(false);

    async function toggleStatus(): Promise<void> {
        const toggledStatus: string = userContext.userData.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
        setDisabled(true);

        try {
            const response = await fetchUpdatedUser({
                ...userContext.userData, 
                status: toggledStatus
            });
    
            userContext.setUserData({ ...response.userData });
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
            // Ignore error message and do nothing
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

    return (
        <div className="flex gap-4 items-center">
            <div>
                <p className="text-right text-[14px]">{userContext.userData.username}</p>
                <p className="text-right text-main-blue text-[14px]">{userContext.userData.email}</p>
            </div>
            <div className="cursor-pointer relative">
                <div onClick={() => setNavProfileDropdown(true)}>
                    <ProfilePicAndStatus 
                        profilePicURL={userContext.userData.profilePicURL} 
                        profileStatus={userContext.userData.status} 
                    />
                </div>
                <OutsideClickHandler onOutsideClick={() => setNavProfileDropdown(false)}>
                    {navProfileDropdown && <ul className="absolute bg-main-white shadow-profile-page-container 
                    mt-2 border-light-gray border-2 rounded-[11px] right-0 z-10 overflow-hidden">
                        <div className="border-b border-light-gray">
                            <p className="whitespace-nowrap p-3 pt-1 pb-1 cursor-default select-none profile-menu-element">
                                Signed in as: <span className="text-main-blue">{userContext.userData.username}</span>
                            </p>
                        </div>
                        <div className="border-b border-light-gray flex flex-col">
                            <p className="profile-menu-element" onClick={openSettings}>
                                Account Settings
                            </p>
                            {userContext.userData.seller && 
                            <p className="profile-menu-element" onClick={openSellerProfile}>
                                Update seller profile
                            </p>}
                            <button className="profile-menu-element" onClick={toggleStatus} disabled={disabled}>
                                Appear {userContext.userData.status === 'ONLINE' ? 'offline': 'online'}
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