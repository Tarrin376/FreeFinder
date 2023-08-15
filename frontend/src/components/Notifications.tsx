import SidePopUpWrapper from "src/wrappers/SidePopUpWrapper";
import SettingsIcon from "../assets/settings.png";
import { NotificationSections } from "src/enums/NotificationSections";
import { useState, useContext } from "react";
import AllNotifications from "./AllNotifications";
import NotificationSettings from "./NotificationSettings";
import { AnimatePresence } from "framer-motion";
import axios, { AxiosError } from "axios";
import { UserContext } from "src/providers/UserProvider";
import { getAPIErrorMessage } from "src/utils/getAPIErrorMessage";
import ErrorPopUp from "./ErrorPopUp";

interface NotificationsProps {
    toggleNotifications: () => void,
    setUnreadNotifications: React.Dispatch<React.SetStateAction<number>>
}

function Notifications({ toggleNotifications, setUnreadNotifications }: NotificationsProps) {
    const [section, setSection] = useState<NotificationSections>(NotificationSections.allNotifications);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [allRead, setAllRead] = useState<boolean>(false);
    const userContext = useContext(UserContext);

    async function markAllAsRead(): Promise<void> {
        try {
            await axios.put<{ message: string }>(`/api/users/${userContext.userData.username}/notifications/all`);
            setUnreadNotifications(0);
            setAllRead(true);
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            setErrorMessage(errorMessage);
        }
    }

    return (
        <SidePopUpWrapper setIsOpen={toggleNotifications}>
            <div className="bg-main-white shadow-lg rounded-[8px] absolute top-full mt-[6px]
            right-0 w-[400px] h-[500px] border border-light-border-gray flex flex-col">
                <div className="flex-grow flex flex-col min-h-0 overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-light-border-gray">
                        <h2 className="text-[20px]">
                            Notifications
                        </h2>
                        <span className="text-main-blue cursor-pointer text-[15px]" onClick={markAllAsRead}>
                            Mark all as read
                        </span>
                    </div>
                    <AnimatePresence>
                        {section === NotificationSections.settings && 
                        <NotificationSettings 
                            updateSection={setSection} 
                        />}
                        {errorMessage !== "" && 
                        <ErrorPopUp 
                            errorMessage={errorMessage} 
                            setErrorMessage={setErrorMessage}
                        />}
                    </AnimatePresence>
                    {section === NotificationSections.allNotifications && 
                    <AllNotifications
                        setUnreadNotifications={setUnreadNotifications}
                        allRead={allRead}
                    />}
                </div>
                <div className="p-4 border-t border-light-border-gray flex items-center">
                    <button onClick={() => setSection(NotificationSections.settings)}>
                        <img src={SettingsIcon} className="w-[24px] h-[24px]" alt="settings" />
                    </button>
                </div>
            </div>
        </SidePopUpWrapper>
    )
}

export default Notifications;