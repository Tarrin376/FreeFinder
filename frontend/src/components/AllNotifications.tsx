import { usePaginateData } from "src/hooks/usePaginateData";
import { INotification } from "src/models/INotification";
import { PaginationResponse } from "src/types/PaginateResponse";
import { useState, useRef, useContext, useEffect, useCallback } from "react";
import { UserContext } from "src/providers/UserProvider";
import Notification from "./Notification";

interface AllNotificationsProps {
    setUnreadNotifications: React.Dispatch<React.SetStateAction<number>>,
    allRead: boolean
}

function AllNotifications({ setUnreadNotifications, allRead }: AllNotificationsProps) {
    const userContext = useContext(UserContext);
    const [page, setPage] = useState<{ value: number }>({ value: 1 });

    const pageRef = useRef<HTMLDivElement>(null);
    const cursor = useRef<string>();
    const url = `/api/users/${userContext.userData.username}/notifications/all`;
    const notifications = usePaginateData<{}, INotification, PaginationResponse<INotification>>(pageRef, cursor, url, page, setPage, {});
    const [allNotifications, setAllNotifications] = useState<INotification[]>([]);

    const addNotification = useCallback((notification: INotification) => {
        setAllNotifications((cur) => [notification, ...cur]);
    }, []);

    useEffect(() => {
        setAllNotifications(notifications.data);
    }, [notifications.data]);

    useEffect(() => {
        userContext.socket?.on("receive-notification", addNotification);

        return () => {
            userContext.socket?.off("receive-notification", addNotification);
        }
    }, [userContext.socket, addNotification]);

    return (
        <div className="flex-grow overflow-y-scroll" ref={pageRef}>
            {allNotifications.map((notification: INotification) => {
                return (
                    <Notification
                        title={notification.title}
                        text={notification.text}
                        createdAt={notification.createdAt}
                        unread={notification.unread}
                        notificationID={notification.notificationID}
                        setUnreadNotifications={setUnreadNotifications}
                        allRead={allRead}
                        key={notification.notificationID}
                    />
                )
            })}
        </div>
    )
}

export default AllNotifications;