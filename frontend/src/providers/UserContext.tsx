import { createContext, useState, useEffect } from 'react';
import { IUser } from '../models/IUser';
import axios from "axios";
import io, { Socket } from "socket.io-client";

export const initialState: IUserContext = {
    userData: {
        username: "",
        country: "",
        profilePicURL: "",
        email: "",
        status: "",
        userID: "",
        seller: null,
        savedPosts: new Set(),
        savedSellers: new Set()
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
    const [socket, setSocket] = useState<Socket>();
    
    useEffect(() => {
        try {
            if (socket) {
                return;
            }

            const ws = io(`http://localhost:8000`);
            ws.on('connect', () => {
                axios.post<{ userData: IUser, message: string }>(`/api/users/jwt-auth`, { socketID: ws.id })
                .then((resp) => {
                    setSocket(ws);
                    setUserData({
                        ...resp.data.userData, 
                        savedPosts: new Set(resp.data.userData.savedPosts),
                        savedSellers: new Set(resp.data.userData.savedSellers)
                    });
                })
                .catch(() => {
                    // Do nothing if the user's session has expired or is invalid.
                })
            });
        }
        catch (err: any) {
            // Handle connection error.
        }

        return () => {
            socket?.disconnect();
        }
    }, [socket]);

    return (
        <UserContext.Provider value={{userData, socket, setUserData}}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;