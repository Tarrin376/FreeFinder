import { createContext, useState } from 'react';
import { IUser } from '../models/IUser';

export interface IUserContext {
    userData: IUser
    setUserData: (_: IUser) => void
}

export const initialState: IUserContext = {
    userData: {
        username: "",
        country: "",
        profilePicURL: "",
        email: "",
        status: "ONLINE",
        userID: "",
        memberDate: new Date(),
    },
    setUserData: (_: IUser) => {}
}

export const UserContext = createContext<IUserContext>(initialState);

function UserProvider({ children }: { children?: React.ReactNode }) {
    const [userData, setUserData] = useState<IUser>({...initialState.userData});

    return (
        <UserContext.Provider value={{userData, setUserData}}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;