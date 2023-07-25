import { useEffect, useContext, useCallback, useState } from "react";
import { UserContext } from "../providers/UserContext";

export function useUsersTyping(groupID: string): string[] {
    const userContext = useContext(UserContext);
    const [usersTyping, setUsersTyping] = useState<string[]>([]);

    const updateUsersTyping = useCallback((username: string, id: string) => {
        if (id !== groupID || usersTyping.includes(username)) {
            return;
        }

        setUsersTyping((cur) => [...cur, username]);
        setTimeout(() => setUsersTyping((cur) => cur.filter((x) => x !== username)), 5000);
    }, [usersTyping, groupID]);

    useEffect(() => {
        if (userContext.socket) {
            userContext.socket.on("user-typing", updateUsersTyping);
        }

        return () => {
            userContext.socket?.off("user-typing", updateUsersTyping);
        }
    }, [userContext.socket, updateUsersTyping]);

    return usersTyping;
}