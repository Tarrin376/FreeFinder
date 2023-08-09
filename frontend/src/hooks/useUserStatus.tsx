import { UserStatus } from "src/enums/UserStatus";
import { useState, useCallback, useEffect, useContext } from "react";
import { UserContext } from "src/providers/UserProvider";

export function useUserStatus(username: string | undefined, initialStatus: UserStatus | undefined): UserStatus {
    const [status, setStatus] = useState<UserStatus>(UserStatus.OFFLINE);
    const userContext = useContext(UserContext);

    const updateUserStatus = useCallback((curUsername: string, status: UserStatus) => {
        if (username === curUsername) {
            setStatus(status);
        }
    }, [username]);

    useEffect(() => {
        userContext.socket?.on("show-user-status", updateUserStatus);

        return () => {
            userContext.socket?.off("show-user-status", updateUserStatus);
        }
    }, [updateUserStatus, userContext.socket]);

    useEffect(() => {
        setStatus(initialStatus || UserStatus.OFFLINE);
    }, [initialStatus]);

    return status;
}