import { useRef, useEffect, useCallback, useContext } from "react";
import { UserContext } from "../providers/UserProvider";
import axios from "axios";
import { IUser } from "../models/IUser";
import { UserStatus } from "../enums/UserStatus";

const AWAY_TRIGGER_DURATION = 120;

export function useToggleAwayStatus(): void {
    const userContext = useContext(UserContext);
    const lastActive = useRef<number>(Date.now());
    const canCheck = useRef<boolean>(true);
    const prevStatus = useRef<UserStatus>(userContext.userData.status);
    
    const updateLastActive = useCallback((): void => {
        (async () => {
            try {
                if (!canCheck.current) {
                    return;
                }

                canCheck.current = false;
                if (userContext.userData.status === UserStatus.AWAY) {
                    const setToOnline = await axios.put<{ userData: IUser, message: string }>
                    (`/api/users/${userContext.userData.username}`, {
                        update: {
                            status: prevStatus.current
                        }
                    });
                    
                    userContext.socket?.volatile.emit("update-user-status", userContext.userData.username, prevStatus.current);
                    userContext.setUserData({ ...setToOnline.data.userData });
                }

                setTimeout(() => {
                    canCheck.current = true;
                }, 10000);
            }
            catch (_: any) {
                // Ignore failure setting the user status to online and try again later.
            }
            finally {
                lastActive.current = Date.now();
            }
        })();
    }, [userContext]);

    useEffect(() => {
        const interval = setInterval(() => {
            (async () => {
                try {
                    const now = Date.now();
                    if ((now - lastActive.current) / 1000 >= AWAY_TRIGGER_DURATION && userContext.userData.status !== UserStatus.OFFLINE &&
                    userContext.userData.status !== UserStatus.AWAY) {
                        const setToAway = await axios.put<{ userData: IUser, message: string }>
                        (`/api/users/${userContext.userData.username}`, { 
                            update: {
                                status: UserStatus.AWAY 
                            }
                        });
                        
                        userContext.socket?.volatile.emit("update-user-status", userContext.userData.username, UserStatus.AWAY);
                        userContext.setUserData({ ...setToAway.data.userData });
                    }
                }
                catch (_: any) {
                    // Ignore failure setting user status to away and try again every 5 seconds.
                }
            })();
        }, 10000);

        return () => {
            clearInterval(interval);
        }
    }, [userContext, userContext.userData.username]);

    useEffect(() => {
        if (userContext.userData.status !== UserStatus.AWAY) {
            prevStatus.current = userContext.userData.status;
        }
    }, [userContext.userData.status]);

    useEffect(() => {
        window.addEventListener("mousemove", updateLastActive);

        return () => {
            window.removeEventListener("mousemove", updateLastActive);
        }
    }, [updateLastActive]);
}