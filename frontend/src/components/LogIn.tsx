import PopUpWrapper from "../layouts/PopUpWrapper";
import { useState, useContext } from 'react';
import ErrorMessage from "./ErrorMessage";
import { IUserContext, UserContext } from "../context/UserContext";
import LoadingButton from "./LoadingButton";

interface LogInProps {
    setLogIn: React.Dispatch<React.SetStateAction<boolean>>,
    setSignUp: React.Dispatch<React.SetStateAction<boolean>>
}

function LogIn({ setLogIn, setSignUp }: LogInProps) {
    const [usernameOrEmail, setUsernameOrEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const userContext = useContext<IUserContext>(UserContext);
    const [loading, setLoading] = useState<boolean>(false);

    function openSignUp(): void {
        setLogIn(false);
        setSignUp(true);
    }

    async function logInAttempt(e: React.MouseEvent<HTMLButtonElement>): Promise<void> {
        e.preventDefault();
        if (usernameOrEmail === "" || password === "") {
            setErrorMessage("Please fill in both boxes to sign into your account");
            return;
        }

        setLoading(true);
        const findUserAttempt = await fetch(`/user/findUser/${usernameOrEmail}`, {
            method: 'POST',
            body: JSON.stringify({ password: password }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            return res.json();
        })
        .catch(() => {
            setErrorMessage(`An unexpected error occured when trying to create your account. 
            Make sure you are connected to the internet and try again.`);
        });

        setLoading(false);
        if (findUserAttempt.status === 200 && findUserAttempt.data) {
            findUserAttempt.data.memberDate = new Date(findUserAttempt.data.memberDate);
            userContext.setUserData(findUserAttempt.data);
            setLogIn(false);
        } else {
            setErrorMessage(findUserAttempt.message);
        }
    }

    return (
        <PopUpWrapper setIsOpen={setLogIn}>
            <form>
                <h1 className="text-[26px] mb-2">Welcome back!</h1>
                <p className="mb-6 text-side-text-gray text-[15px]">Enter your details below</p>
                {errorMessage !== "" && <ErrorMessage message={errorMessage} title={"There was a problem signing in."} />}
                <div className="flex gap-3 flex-col mb-8">
                    <input type="text" placeholder="Your email or username" className="search-bar" onChange={(e) => setUsernameOrEmail(e.target.value)} />
                    <input type="password" placeholder="Password" className="search-bar" onChange={(e) => setPassword(e.target.value)} />
                </div>
                <LoadingButton loading={loading} text="Login" loadingText="Checking details" callback={logInAttempt} disabled={false} />
                <p className="mt-6 text-side-text-gray text-[15px]">Dont yet have an account? 
                    <span className="text-main-red ml-2 cursor-pointer hover:text-main-black" onClick={openSignUp}>
                        Sign Up
                    </span>
                </p>
            </form>
        </PopUpWrapper>
    );
}

export default LogIn;