import { createContext, useState, useEffect } from 'react';
import { IUser } from '../models/IUser';

export const initialState: IUserContext = {
    userData: {
        username: "",
        country: "",
        profilePicURL: "",
        email: "",
        status: "",
        userID: "",
        memberDate: new Date(),
        seller: {
            description: "",
            rating: 0,
            sellerID: ""
        }
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
                const response = await fetch("/api/users/jwtLogin");
                if (response.status === 200) {
                    const data = await response.json();
                    setUserData(data.userData);
                }
            }
            catch (err: any) {
                // Do nothing if the user is not logged in.
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