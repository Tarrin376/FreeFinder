import { createContext, useState, useEffect } from 'react';
import { IUser } from '../models/IUser';
import axios from "axios";

export const initialState: IUserContext = {
    userData: {
        username: "",
        country: "",
        profilePicURL: "",
        email: "",
        status: "",
        userID: "",
        memberDate: new Date(),
        seller: null
    },
    setUserData: (_: IUser) => {}
}

export const UserContext = createContext<IUserContext>(initialState);

export interface IUserContext {
    userData: IUser
    setUserData: (_: IUser) => void
}

function UserProvider({ children }: { children?: React.ReactNode }) {
    const [userData, setUserData] = useState<IUser>({ ...initialState.userData });
    
    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const resp = await axios.get<{ userData: IUser, message: string }>(`/api/users/jwt-auth`);
                setUserData(resp.data.userData);
            }
            catch (err: any) {
                // Do nothing if the user's session has expired or is invalid.
            }
        })();
    }, []);

    return (
        <UserContext.Provider value={{userData, setUserData}}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;