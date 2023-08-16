import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "src/providers/UserProvider";
import { useTimeCreated } from "src/hooks/useTimeCreated";
import { useNavigate } from "react-router-dom";

interface NotificationProps {
    title: string,
    text: string,
    createdAt: Date,
    unread: boolean,
    notificationID: string,
    navigateTo: string | null,
    setUnreadNotifications: React.Dispatch<React.SetStateAction<number>>,
    allRead: boolean
}

function Notification({ title, text, createdAt, unread, notificationID, navigateTo, setUnreadNotifications, allRead }: NotificationProps) {
    const [isUnread, setIsUnread] = useState<boolean>(unread);
    const userContext = useContext(UserContext);
    const timeCreated = useTimeCreated(createdAt);
    const navigate = useNavigate();

    async function markAsRead(): Promise<void> {
        if (isUnread && !allRead) {
            setIsUnread(false);
            try {
                await axios.put<{ message: string }>(`/api/users/${userContext.userData.username}/notifications/${notificationID}`);
                setUnreadNotifications((cur) => cur - 1);
            }
            catch (err: any) {
                setIsUnread(true);
                // Ignore failure to update notification and try again when the user hovers over the component.
            }
        }
    }

    function navigateToPage(): void {
        if (navigateTo) {
            navigate(navigateTo);
        }
    }

    return (
        <div className="p-4 border-b border-light-border-gray cursor-pointer hover:bg-light-bg-gray transition-all duration-150 ease-linear" 
        onMouseEnter={markAsRead} onClick={navigateToPage}>
            <div className="flex items-center gap-[10px]">
                <div className={`w-[7px] h-[7px] rounded-full ${isUnread && !allRead ? "bg-main-blue" : "bg-side-text-gray"}`}>
                </div>
                <h3>
                    {title}
                </h3>
            </div>
            <p className="text-sm text-side-text-gray mt-[6px] pl-[17px]">
                {text}
            </p>
            <p className="text-sm text-side-text-gray font-bold mt-[6px] pl-[17px]">
                {timeCreated}
            </p>
        </div>
    )
}

export default Notification;