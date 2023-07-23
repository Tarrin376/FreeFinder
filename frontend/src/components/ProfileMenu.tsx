import ProfilePicAndStatus from "./ProfilePicAndStatus";
import { useState, useContext } from 'react';
import { fetchUpdatedUser } from "../utils/fetchUpdatedUser";
import OutsideClickHandler from "react-outside-click-handler";
import NotificationIcon from "../assets/notification.png";
import { UserContext } from "../providers/UserContext";
import { UserStatus } from "../enums/UserStatus";
import { useNavigate } from "react-router-dom";
import AccountSettings from "../views/AccountSettings/AccountSettings";
import ChangeSellerDetails from "./ChangeSellerDetails";
import { AnimatePresence } from "framer-motion";
import AccountBalance from "./AccountBalance";
import ChatIcon from "../assets/chat.png";
import Messages from "./Messages";

interface ProfileMenuProps {
    logout: () => Promise<void>
}

function ProfileMenu({ logout }: ProfileMenuProps) {
    const [disabled, setDisabled] = useState<boolean>(false);
    const [navProfileDropdown, setNavProfileDropdown] = useState<boolean>(false);
    const [settingsPopUp, setSettingsPopUp] = useState<boolean>(false);
    const [sellerProfilePopUp, setSellerProfilePopUp] = useState<boolean>(false);
    const [balancePopUp, setBalancePopUp] = useState<boolean>(false);
    const [messagesPopUp, setMessagesPopUp] = useState<boolean>(false);
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

    function viewSettings(): void {
        setNavProfileDropdown(false);
        setSettingsPopUp(true);
    }

    function viewSellerProfile(): void {
        setNavProfileDropdown(false);
        setSellerProfilePopUp(true);
    }

    function viewBalance(): void {
        setNavProfileDropdown(false);
        setBalancePopUp(true);
    }

    function viewProfile(): void {
        navigate(`/sellers/${userContext.userData.seller?.sellerID}`);
        setNavProfileDropdown(false);
    }

    function viewMessages(): void {
        setNavProfileDropdown(false);
        setMessagesPopUp(true);
    }

    return (
        <div className="flex gap-7 items-center z-30">
            <AnimatePresence>
                {settingsPopUp && <AccountSettings setSettingsPopUp={setSettingsPopUp} />}
                {sellerProfilePopUp && <ChangeSellerDetails setSellerProfilePopUp={setSellerProfilePopUp} />}
                {balancePopUp && <AccountBalance setBalancePopUp={setBalancePopUp} />}
                {messagesPopUp && <Messages setMessagesPopUp={setMessagesPopUp} />}
            </AnimatePresence>
            <div className="flex gap-4 items-center">
                <img src={ChatIcon} className="w-[32px] h-[32px] cursor-pointer" alt="chat" onClick={viewMessages} />
                <div className="relative cursor-pointer">
                    <img src={NotificationIcon} className="w-[32px] h-[32px]" alt="notifications" />
                    <span className="absolute top-[2px] right-[3px] flex h-3 w-3">
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
                        username={userContext.userData.username}
                        size={48}
                    />
                </div>
                <OutsideClickHandler onOutsideClick={() => setNavProfileDropdown(false)}>
                    {navProfileDropdown && 
                    <ul className="absolute bg-main-white shadow-lg
                    mt-2 border border-light-border-gray rounded-[11px] right-0 overflow-hidden">
                        <div className="border-b border-light-border-gray">
                            <p className="whitespace-nowrap p-3 pt-1 pb-1 cursor-default profile-menu-element hover:!bg-main-white">
                                Signed in as: <span className="text-main-blue text-[15px]">{userContext.userData.username}</span>
                            </p>
                        </div>
                        <div className="border-b border-light-border-gray flex flex-col">
                            <p className="profile-menu-element" onClick={viewBalance}>
                                Your balance
                            </p>
                            {userContext.userData.seller &&
                            <p className="profile-menu-element" onClick={viewProfile}>
                                View profile
                            </p>}
                            <p className="profile-menu-element" onClick={viewSettings}>
                                Account settings
                            </p>
                            {userContext.userData.seller && 
                            <p className="profile-menu-element" onClick={viewSellerProfile}>
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