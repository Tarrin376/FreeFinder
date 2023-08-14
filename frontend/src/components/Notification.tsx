import { useState, useContext } from "react";
import { getTimeCreated } from "src/utils/getTimeCreated";
import axios from "axios";
import { UserContext } from "src/providers/UserProvider";

interface NotificationProps {
    title: string,
    text: string,
    createdAt: Date,
    unread: boolean,
    notificationID: string
}

function Notification({ title, text, createdAt, unread, notificationID }: NotificationProps) {
    const [isUnread, setIsUnread] = useState<boolean>(unread);
    const userContext = useContext(UserContext);

    async function markAsRead(): Promise<void> {
        if (!isUnread) {
            return;
        }
        
        try {
            await axios.put<{ message: string }>(`/api/users/${userContext.userData.username}/notifications/${notificationID}`);
            setIsUnread(false);
        }
        catch (err: any) {
            // Ignore failure to update notification and try again when the user hovers over the component.
        }
    }

    return (
        <div className="p-4 border-b border-light-border-gray cursor-pointer hover:bg-hover-light-gray" onMouseEnter={markAsRead}>
            <div className="flex items-center gap-2">
                {isUnread && <div className="w-[7px] h-[7px] rounded-full bg-main-blue"></div>}
                <h3>{title}</h3>
            </div>
            <p className={`text-sm text-side-text-gray ${isUnread ? "pl-[15px]" : ""} mt-[6px]`}>
                {text}
            </p>
            <p className={`text-sm text-side-text-gray font-bold ${isUnread ? "pl-[15px]" : ""} mt-[6px]`}>
                {getTimeCreated(createdAt)}
            </p>
        </div>
    )
}

export default Notification;