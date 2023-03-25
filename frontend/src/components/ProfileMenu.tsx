import ProfilePicAndStatus from "./ProfilePicAndStatus";
import { IUserContext } from "../context/UserContext";
import { initialState } from "../context/UserContext";
import { useState } from 'react';
import { fetchUpdatedUser } from "../utils/fetchUpdatedUser";
import { UpdateResponse } from "../utils/fetchUpdatedUser";
import OutsideClickHandler from "react-outside-click-handler";

interface ProfileMenuProps {
    userContext: IUserContext,
    setSettingsPopUp: React.Dispatch<React.SetStateAction<boolean>>,
    setSellerProfilePopUp: React.Dispatch<React.SetStateAction<boolean>>
}

function ProfileMenu({ userContext, setSettingsPopUp, setSellerProfilePopUp }: ProfileMenuProps) {
    const [disabled, setDisabled] = useState<boolean>(false);
    const [navProfileDropdown, setNavProfileDropdown] = useState<boolean>(false);

    async function toggleStatus(): Promise<void> {
        setDisabled(true);
        const toggledStatus: string = userContext.userData.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
        const updated: Promise<UpdateResponse> = fetchUpdatedUser({
            ...userContext.userData, 
            status: toggledStatus
        });
        
        updated.then((response) => {
            if (response.userData && response.message === "success") {
                userContext.setUserData({ ...response.userData });
            }
        });

        setDisabled(false);
    }

    async function logOut(): Promise<void> {
        try {
            const clearToken = await fetch("/users/logout");
            if (clearToken.status === 500) {
                console.log(`Looks like we are having trouble on our end. Please try again later. 
                (Error code: ${clearToken.status})`);
            } else if (clearToken.status === 403) {
                console.log("You do not have authorisation to perform this action");
            } else {
                const response = await clearToken.json();
                if (clearToken.status === 200) {
                    userContext.setUserData(initialState.userData);
                } else {
                    console.log(response.message);
                }
            }
        }
        catch (err: any) {
            console.log(err.message);
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
                <p className="text-right text-main-purple text-[14px]">{userContext.userData.email}</p>
            </div>
            <div className="cursor-pointer relative">
                <div onClick={() => setNavProfileDropdown(true)}>
                    <ProfilePicAndStatus profilePicURL={userContext.userData.profilePicURL} profileStatus={userContext.userData.status} />
                </div>
                <OutsideClickHandler onOutsideClick={() => setNavProfileDropdown(false)}>
                    {navProfileDropdown && <ul className="absolute bg-main-black mt-2 border-nav-search-gray border rounded-[11px] right-0 z-10 overflow-hidden">
                        <div className="border-b border-[#3E3E3E]">
                            <p className="whitespace-nowrap p-3 pt-1 pb-1 cursor-default select-none profile-menu-element hover:bg-main-black">
                                Signed in as: <b className="text-main-white">{userContext.userData.username}</b>
                            </p>
                        </div>
                        <div className="border-b border-[#3E3E3E] flex flex-col">
                            <p className="profile-menu-element" onClick={openSettings}>Account Settings</p>
                            {userContext.userData.seller && <p className="profile-menu-element" onClick={openSellerProfile}>Update seller profile</p>}
                            <button className="profile-menu-element" onClick={toggleStatus} disabled={disabled}>
                                Appear {userContext.userData.status === 'ONLINE' ? 'offline': 'online'}
                            </button>
                        </div>
                        <div className="flex flex-col">
                            <p className="profile-menu-element rounded-bl-[11px] rounded-br-[11px]" onClick={logOut}>Log out</p>
                        </div>
                    </ul>}
                </OutsideClickHandler>
            </div>
        </div>
    )
}

export default ProfileMenu;