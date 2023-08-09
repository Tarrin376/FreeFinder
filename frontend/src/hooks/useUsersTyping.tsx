import { useEffect, useContext, useCallback, useState } from "react";
import { UserContext } from "../providers/UserProvider";

export function useUsersTyping(groupID: string): string[] {
    const userContext = useContext(UserContext);
    const [usersTyping, setUsersTyping] = useState<string[]>([]);

    const updateUsersTyping = useCallback((username: string, id: string) => {
        if (id !== groupID || usersTyping.includes(username) || username === userContext.userData.username) {
            return;
        }

        setUsersTyping((cur) => [...cur, username]);
        setTimeout(() => setUsersTyping((cur) => cur.filter((x) => x !== username)), 4000);
    }, [usersTyping, groupID, userContext.userData.username]);

    useEffect(() => {
        userContext.socket?.on("user-typing", updateUsersTyping);

        return () => {
            userContext.socket?.off("user-typing", updateUsersTyping);
        }
    }, [userContext.socket, updateUsersTyping]);

    return usersTyping;
}