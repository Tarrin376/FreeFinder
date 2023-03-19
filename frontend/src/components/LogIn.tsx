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
            setErrorMessage("Please fill in both inputs to sign into your account");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`/user/findUser/${usernameOrEmail}`, {
                method: 'POST',
                body: JSON.stringify({ password: password }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            const user = await response.json();
            if (user.userData) {
                const {seller, ...userData} = user.userData;
                userData.memberDate = new Date(userData.memberDate);
                userContext.setUserData(userData);
                setLogIn(false);
            } else {
                setErrorMessage(user.error);
            }
        }
        catch (err: any) {
            setErrorMessage(err.message);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <PopUpWrapper setIsOpen={setLogIn} title={"Welcome back!"} styles={"!mb-5"}>
            <form>
                <p className="mb-6 text-side-text-gray text-[15px]">Enter your details below</p>
                {errorMessage !== "" && <ErrorMessage message={errorMessage} title={"There was a problem signing in."} />}
                <div className="flex gap-3 flex-col mb-8">
                    <input type="text" placeholder="Your email or username" className="search-bar" onChange={(e) => setUsernameOrEmail(e.target.value)} />
                    <input type="password" placeholder="Password" className="search-bar" onChange={(e) => setPassword(e.target.value)} />
                </div>
                <LoadingButton 
                    loading={loading} text="Login" loadingText="Checking details" 
                    callback={logInAttempt} disabled={false} styles={"main-btn"} loadingColour="bg-main-black"
                />
                <p className="mt-6 text-side-text-gray text-[15px]">Dont yet have an account? 
                    <span className="text-main-purple ml-2 cursor-pointer hover:text-main-black" onClick={openSignUp}>
                        Sign Up
                    </span>
                </p>
            </form>
        </PopUpWrapper>
    );
}

export default LogIn;