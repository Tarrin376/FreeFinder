import PopUpWrapper from "../wrappers/PopUpWrapper";
import { useState, useContext } from 'react';
import ErrorMessage from "./ErrorMessage";
import { IUserContext, UserContext } from "../providers/UserProvider";
import axios, { AxiosError } from "axios";
import { IUser } from "../models/IUser";
import { getAPIErrorMessage } from "../utils/getAPIErrorMessage";
import Button from "./Button";

interface LogInProps {
    setLogIn: React.Dispatch<React.SetStateAction<boolean>>,
    setSignUp: React.Dispatch<React.SetStateAction<boolean>>
}

function LogIn({ setLogIn, setSignUp }: LogInProps) {
    const [usernameOrEmail, setUsernameOrEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const userContext = useContext<IUserContext>(UserContext);

    function closeLoginPopUp(): void {
        setLogIn(false);
    }

    function openSignUp(): void {
        closeLoginPopUp();
        setSignUp(true);
    }

    async function logInAttempt(): Promise<string | undefined> {
        if (usernameOrEmail === "" || password === "") {
            return "Please fill in both inputs to sign into your account";
        }

        try {
            const resp = await axios.post<{ userData: IUser, message: string }>(`/api/users/session`, {
                usernameOrEmail: usernameOrEmail,
                password: password,
                socketID: userContext.socket ? userContext.socket.id : undefined
            });

            userContext.setUserData({ ...resp.data.userData });
            closeLoginPopUp();
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            return errorMessage;
        }
    }

    return (
        <PopUpWrapper setIsOpen={setLogIn} title="Welcome back!" styles="!max-w-[470px]">
            <form>
                <p className="mb-6 text-side-text-gray text-[16px]">Enter your details below</p>
                {errorMessage !== "" && 
                <ErrorMessage 
                    message={errorMessage} 
                    title="There was a problem signing in."
                    setErrorMessage={setErrorMessage}
                />}
                <div className="flex gap-3 flex-col mb-8">
                    <input 
                        type="text" 
                        placeholder="Your email or username" 
                        className="search-bar" onChange={(e) => setUsernameOrEmail(e.target.value)} 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        autoComplete="password" 
                        className="search-bar" onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>
                <Button
                    action={logInAttempt}
                    defaultText="Log In"
                    loadingText="Logging in"
                    styles="main-btn"
                    textStyles="text-main-white"
                    setErrorMessage={setErrorMessage}
                    loadingSvgSize={28}
                    type="submit"
                    keepErrorMessage={true}
                />
            </form>
            <p className="mt-6 text-side-text-gray text-[15px]">Dont yet have an account? 
                <span className="text-main-blue ml-2 cursor-pointer hover:text-main-black" onClick={openSignUp}>
                    Sign Up
                </span>
            </p>
        </PopUpWrapper>
    );
}

export default LogIn;