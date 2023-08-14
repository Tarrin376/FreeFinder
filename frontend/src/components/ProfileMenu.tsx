import ProfilePicAndStatus from "./ProfilePicAndStatus";
import { useState, useContext, useEffect, useCallback } from 'react';
import { fetchUpdatedUser } from "../utils/fetchUpdatedUser";
import NotificationIcon from "../assets/notification.png";
import { UserContext } from "../providers/UserProvider";
import { UserStatus } from "../enums/UserStatus";
import { useNavigate } from "react-router-dom";
import AccountSettings from "../views/AccountSettings/AccountSettings";
import ChangeSellerDetails from "./ChangeSellerDetails";
import { AnimatePresence } from "framer-motion";
import AccountBalance from "./AccountBalance";
import ChatIcon from "../assets/chat.png";
import MessagePreviews from "./MessagePreviews";
import Count from "./Count";
import { GroupPreview } from "src/types/GroupPreview";
import { IMessage } from "src/models/IMessage";
import Notifications from "./Notifications";
import NavDropdown from "./NavDropdown";
import DropdownElement from "./DropdownElement";

interface ProfileMenuProps {
    logout: () => Promise<void>
}

function ProfileMenu({ logout }: ProfileMenuProps) {
    const [disabled, setDisabled] = useState<boolean>(false);
    const [settingsPopUp, setSettingsPopUp] = useState<boolean>(false);
    const [updateSellerProfilePopUp, setUpdateSellerProfilePopUp] = useState<boolean>(false);
    const [balancePopUp, setBalancePopUp] = useState<boolean>(false);
    const [messagesPopUp, setMessagesPopUp] = useState<boolean>(false);
    const [notificationsPopUp, setNotificationsPopUp] = useState<boolean>(false);

    const userContext = useContext(UserContext);
    const [globalUnreadMessages, setGlobalUnreadMessages] = useState<number>(userContext.userData.unreadMessages);
    const [unreadNotifications, setUnreadNotifications] = useState<number>(userContext.userData.unreadNotifications);
    const [group, setGroup] = useState<GroupPreview>();
    const navigate = useNavigate();

    async function toggleStatus(): Promise<void> {
        const toggledStatus = userContext.userData.status === UserStatus.ONLINE ? UserStatus.OFFLINE : UserStatus.ONLINE;
        if (disabled) {
            return;
        }

        setDisabled(true);

        try {
            const response = await fetchUpdatedUser({ status: toggledStatus }, userContext.userData.username);
            userContext.socket?.volatile.emit("update-user-status", userContext.userData.username, toggledStatus);
            userContext.setUserData(response.userData);
        } 
        catch (_: any) {
            // Ignore error message and try again the next time the user toggles their status.
        } 
        finally {
            setDisabled(false);
        }
    }

    function viewSettings(): void {
        setNotificationsPopUp(false);
        setSettingsPopUp(true);
    }

    function viewUpdateSellerProfile(): void {
        setUpdateSellerProfilePopUp(true);
    }

    function viewBalance(): void {
        setBalancePopUp(true);
    }

    function viewProfile(): void {
        navigate(`/sellers/${userContext.userData.seller?.sellerID}`);
    }

    function viewMessages(): void {
        setNotificationsPopUp(false);
        setMessagesPopUp(true);
    }

    function toggleNotifications(): void {
        setNotificationsPopUp((cur) => !cur);
    }

    const updateGlobalUnreadMessages = useCallback((_: IMessage, id: string): void => {
        if (!group || group.groupID !== id) {
            setGlobalUnreadMessages((cur) => cur + 1);
        }
    }, [group]);

    useEffect(() => {
        setGlobalUnreadMessages(userContext.userData.unreadMessages);
        setUnreadNotifications(userContext.userData.unreadNotifications);
    }, [userContext.userData.unreadMessages, userContext.userData.unreadNotifications]);

    useEffect(() => {
        userContext.socket?.on("receive-message", updateGlobalUnreadMessages);

        return () => {
            userContext.socket?.off("receive-message", updateGlobalUnreadMessages);
        }
    }, [userContext.socket, updateGlobalUnreadMessages]);

    return (
        <div className="flex gap-7 items-center z-30">
            <AnimatePresence>
                {settingsPopUp && <AccountSettings setSettingsPopUp={setSettingsPopUp} />}
                {updateSellerProfilePopUp && <ChangeSellerDetails setSellerProfilePopUp={setUpdateSellerProfilePopUp} />}
                {balancePopUp && <AccountBalance setBalancePopUp={setBalancePopUp} />}
                {messagesPopUp && 
                <MessagePreviews 
                    group={group}
                    setGroup={setGroup}
                    setMessagesPopUp={setMessagesPopUp} 
                    setGlobalUnreadMessages={setGlobalUnreadMessages}
                />}
            </AnimatePresence>
            <div className="flex gap-4 items-center">
                <div className="w-fit h-fit relative cursor-pointer" onClick={viewMessages}>
                    <img src={ChatIcon} className="w-[29px] h-[29px]" alt="chat" />
                    {globalUnreadMessages > 0 && 
                    <Count
                        value={globalUnreadMessages}
                        styles="absolute top-[-5px] right-[-6px]"
                    />}
                </div>
                <div className="w-fit relative">
                    <div className="relative cursor-pointer" onClick={toggleNotifications}>
                        <img src={NotificationIcon} className="w-[29px] h-[29px]" alt="notifications" />
                        {unreadNotifications > 0 &&
                        <span className="absolute top-0 right-[2px] flex h-[12px] w-[12px]">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-main-blue opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-hull w-full bg-main-blue"></span>
                        </span>}
                    </div>
                    <AnimatePresence>
                        {notificationsPopUp && 
                        <Notifications 
                            toggleNotifications={toggleNotifications} 
                        />}
                    </AnimatePresence>
                </div>
            </div>
            <div className="cursor-pointer relative">
                <div className="flex gap-3 items-center">
                    <ProfilePicAndStatus 
                        profilePicURL={userContext.userData.profilePicURL} 
                        profileStatus={userContext.userData.status} 
                        username={userContext.userData.username}
                        statusRight={true}
                        size={38}
                    />
                    <NavDropdown textStyles="max-w-[140px] text-ellipsis whitespace-nowrap overflow-hidden"
                    title={userContext.userData.username} textSize={14}>
                        <DropdownElement
                            text="Your balance"
                            action={viewBalance}
                        />
                        {userContext.userData.seller &&
                        <>
                            <DropdownElement
                                text="View profile"
                                action={viewProfile}
                            />
                            <DropdownElement
                                text="Update seller profile"
                                action={viewUpdateSellerProfile}
                            />
                        </>}
                        <DropdownElement
                            text="Account settings"
                            action={viewSettings}
                        />
                        <DropdownElement
                            text={`Appear ${userContext.userData.status === UserStatus.ONLINE ? 'offline': 'online'}`}
                            action={toggleStatus}
                        />
                        <DropdownElement
                            text="Log out"
                            action={logout}
                        />
                    </NavDropdown>
                </div>
            </div>
        </div>
    )
}

export default ProfileMenu;