import SidePopUpWrapper from "src/wrappers/SidePopUpWrapper";
import SettingsIcon from "../assets/settings.png";
import { NotificationSections } from "src/enums/NotificationSections";
import { useState } from "react";
import AllNotifications from "./AllNotifications";
import NotificationSettings from "./NotificationSettings";
import { AnimatePresence } from "framer-motion";

interface NotificationsProps {
    toggleNotifications: () => void
}

function Notifications({ toggleNotifications }: NotificationsProps) {
    const [section, setSection] = useState<NotificationSections>(NotificationSections.allNotifications);

    return (
        <SidePopUpWrapper setIsOpen={toggleNotifications}>
            <div className="bg-main-white shadow-lg rounded-[8px] absolute top-full mt-[6px]
            right-0 w-[400px] h-[500px] border border-light-border-gray flex flex-col">
                <div className="flex-grow flex flex-col min-h-0 overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-light-border-gray">
                        <h2 className="text-[20px]">
                            Notifications
                        </h2>
                        <span className="text-main-blue cursor-pointer text-[15px]">
                            Mark all as read
                        </span>
                    </div>
                    <AnimatePresence>
                        {section === NotificationSections.settings && 
                        <NotificationSettings 
                            updateSection={setSection} 
                        />}
                    </AnimatePresence>
                    {section === NotificationSections.allNotifications && 
                    <AllNotifications />}
                </div>
                <div className="p-4 border-t border-light-border-gray flex items-center justify-between">
                    <button onClick={() => setSection(NotificationSections.settings)}>
                        <img src={SettingsIcon} className="w-[24px] h-[24px]" alt="settings" />
                    </button>
                    <button className="side-btn !h-[30px] w-fit !rounded-[6px] text-[15px]">
                        View all
                    </button>
                </div>
            </div>
        </SidePopUpWrapper>
    )
}

export default Notifications;