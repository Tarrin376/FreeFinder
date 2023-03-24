import { createContext, useState, useEffect } from 'react';
import { IUser } from '../models/IUser';

export const initialState: IUserContext = {
    userData: {
        username: "",
        country: "",
        profilePicURL: "",
        email: "",
        status: "ONLINE",
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
    console.log(userData);

    useEffect(() => {
        (async function authoriseUser() {
            try {
                const response = await fetch("users/authorise");
                if (response.status === 200) {
                    const data = await response.json();
                    setUserData(data.userData);
                }
            }
            catch (err: any) {
                console.log(err.message);
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