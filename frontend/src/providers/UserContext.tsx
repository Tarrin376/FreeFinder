import { createContext, useState, useEffect } from 'react';
import { IUser } from '../models/IUser';
import axios from "axios";
import io, { Socket } from "socket.io-client";
import { UserStatus } from '../enums/UserStatus';
import ErrorPopUp from '../components/ErrorPopUp';
import { AnimatePresence } from 'framer-motion';

export const initialState: IUserContext = {
    userData: {
        username: "",
        country: "",
        profilePicURL: "",
        email: "",
        status: UserStatus.ONLINE,
        userID: "",
        seller: null
    },
    socket: undefined,
    setUserData: (_: IUser) => {}
}

export const UserContext = createContext<IUserContext>(initialState);

export interface IUserContext {
    userData: IUser,
    socket: Socket | undefined,
    setUserData: (_: IUser) => void
}

function UserProvider({ children }: { children?: React.ReactNode }) {
    const [userData, setUserData] = useState<IUser>({ ...initialState.userData });
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [socket, setSocket] = useState<Socket>();

    function raiseFailedConnection(err: Error): void {
        setErrorMessage(`Failed to establish a new web socket connection: ${err.message}`);
    }
    
    useEffect(() => {
        try {
            if (socket) {
                return;
            }

            const ws = io(`http://localhost:8000`, { withCredentials: true });
            ws.on("connect_error", raiseFailedConnection);
            
            ws.on("connect", async () => {
                try {
                    const resp = await axios.post<{ userData: IUser, message: string }>(`/api/users/jwt-auth`, { socketID: ws.id });
                    setUserData(resp.data.userData);
                }
                catch (_: any) {
                    // Do nothing if the user's session has expired or is invalid.
                }
                finally {
                    setSocket(ws);
                }
            });
        }
        catch (_: any) {
            setErrorMessage("Something went wrong. Please try again.");
        }

        return () => {
            socket?.disconnect();
        }
    }, [socket]);

    return (
        <UserContext.Provider value={{userData, socket, setUserData}}>
            <AnimatePresence>
                {errorMessage !== "" &&
                <ErrorPopUp
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                />}
            </AnimatePresence>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;