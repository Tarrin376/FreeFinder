import { useRef, useEffect, useCallback, useContext } from "react";
import { UserContext } from "../providers/UserContext";
import axios from "axios";
import { IUser } from "../models/IUser";
import { UserStatus } from "../enums/UserStatus";

export function useToggleAwayStatus() {
    const userContext = useContext(UserContext);
    const lastActive = useRef<number>(Date.now());
    
    const updateLastActive = useCallback((): void => {
        (async () => {
            try {
                if (userContext.userData.status === UserStatus.AWAY) {
                    const setToOnline = await axios.put<{ userData: IUser, message: string }>
                    (`/api/users/${userContext.userData.username}`, { 
                        status: UserStatus.ONLINE 
                    });
                    
                    userContext.setUserData({
                        ...setToOnline.data.userData, 
                        savedPosts: new Set(setToOnline.data.userData.savedPosts),
                        savedSellers: new Set(setToOnline.data.userData.savedSellers)
                    });
                }
            }
            catch (err: any) {
                // Ignore failure setting the user status to online and try again every time the cursor moves.
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
                    if ((now - lastActive.current) / 1000 >= 120 && userContext.userData.status === UserStatus.ONLINE) {
                        const setToAway = await axios.put<{ userData: IUser, message: string }>
                        (`/api/users/${userContext.userData.username}`, { 
                            status: UserStatus.AWAY 
                        });

                        userContext.setUserData({
                            ...setToAway.data.userData, 
                            savedPosts: new Set(setToAway.data.userData.savedPosts),
                            savedSellers: new Set(setToAway.data.userData.savedSellers)
                        });
                    }
                }
                catch (err: any) {
                    // Ignore failure setting user status to away and try again every 5 seconds.
                }
            })();
        }, 5000);

        return () => {
            clearInterval(interval);
        }
    }, [userContext, userContext.userData.username])

    useEffect(() => {
        window.addEventListener("mousemove", updateLastActive);

        return () => {
            window.removeEventListener("mousemove", updateLastActive);
        }
    }, [updateLastActive]);
}