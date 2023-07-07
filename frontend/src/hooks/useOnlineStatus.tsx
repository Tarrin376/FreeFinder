import { useEffect, useCallback, useState } from "react";

export function useOnlineStatus() {
    const [onlineMessage, setOnlineMessage] = useState<string>("");
    const [offlineMessage, setOfflineMessage] = useState<string>("");

    function closePopUp() {
        setOnlineMessage("");
        setOfflineMessage("");
    }

    const showOnlineMessage = useCallback((): void => {
        setOfflineMessage("");
        setOnlineMessage("You are back online");
    }, []);

    const showOfflineMessage = useCallback((): void => {
        setOnlineMessage("");
        setOfflineMessage("You are now offline");
    }, []);

    useEffect(() => {
        window.addEventListener("online", showOnlineMessage);
        window.addEventListener("offline", showOfflineMessage);

        return () => {
            window.removeEventListener("online", showOnlineMessage);
            window.removeEventListener("offline", showOfflineMessage);
        }
    }, [showOfflineMessage, showOnlineMessage]);

    return {
        onlineMessage,
        offlineMessage,
        closePopUp
    }
}