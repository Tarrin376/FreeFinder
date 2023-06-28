import PopUpWrapper from "../layouts/PopUpWrapper";
import { useState, useContext } from 'react';
import ErrorMessage from "./ErrorMessage";
import { IUserContext, UserContext } from "../providers/UserContext";
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

    function closeLoginPopUp() {
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
                usernameOrEmail,
                password,
            });

            resp.data.userData.memberDate = new Date(resp.data.userData.memberDate);
            userContext.setUserData(resp.data.userData);
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            return errorMessage;
        }
    }

    return (
        <PopUpWrapper setIsOpen={setLogIn} title={"Welcome back!"} styles="!max-w-[470px]">
            <form>
                <p className="mb-6 text-side-text-gray text-[16px]">Enter your details below</p>
                {errorMessage !== "" && <ErrorMessage message={errorMessage} title={"There was a problem signing in."} />}
                <div className="flex gap-3 flex-col mb-8">
                    <input type="text" placeholder="Your email or username" className="search-bar" onChange={(e) => setUsernameOrEmail(e.target.value)} />
                    <input type="password" placeholder="Password" className="search-bar" onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Button
                    action={logInAttempt}
                    completedText="Logged in"
                    defaultText="Login"
                    loadingText="Logging in"
                    styles="main-btn"
                    textColor="text-main-white"
                    setErrorMessage={setErrorMessage}
                    whenComplete={closeLoginPopUp}
                />
                <p className="mt-6 text-side-text-gray text-[15px]">Dont yet have an account? 
                    <span className="text-main-blue ml-2 cursor-pointer hover:text-main-black" onClick={openSignUp}>
                        Sign Up
                    </span>
                </p>
            </form>
        </PopUpWrapper>
    );
}

export default LogIn;