import { UserStatus } from "src/enums/UserStatus";
import { useState, useCallback, useEffect, useContext } from "react";
import { UserContext } from "src/providers/UserContext";

export function useUserStatus(username: string, initialStatus: UserStatus): UserStatus {
    const [status, setStatus] = useState<UserStatus>(initialStatus);
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

    return status;
}