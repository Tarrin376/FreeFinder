import PopUpWrapper from "../wrappers/PopUpWrapper";
import { useState, useReducer } from 'react';
import ErrorMessage from "./ErrorMessage";
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from "../utils/getAPIErrorMessage";
import Button from "./Button";
import CountriesDropdown from "./CountriesDropdown";
import { EMAIL_REGEX, MAX_EMAIL_LENGTH } from "@freefinder/shared/dist/constants";
import Validator from "@freefinder/shared/dist/validator";

interface SignUpProps {
    setLogIn: React.Dispatch<React.SetStateAction<boolean>>,
    setSignUp: React.Dispatch<React.SetStateAction<boolean>>,
    setAccountCreated: React.Dispatch<React.SetStateAction<boolean>>
}

type SignUpState = {
    emailFirst: string,
    emailSecond: string,
    username: string,
    password: string,
    country: string,
    emailFirstErrorMessage: string,
    emailSecondErrorMessage: string,
    usernameErrorMessage: string,
    passwordErrorMessage: string,
}

const INITIAL_STATE: SignUpState = {
    emailFirst: "",
    emailSecond: "",
    username: "",
    password: "",
    country: "🇬🇧 United Kingdom",
    emailFirstErrorMessage: "",
    emailSecondErrorMessage: "",
    usernameErrorMessage: "",
    passwordErrorMessage: ""
}

function SignUp({ setLogIn, setSignUp, setAccountCreated }: SignUpProps) {
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [country, setCountry] = useState<string>("🇬🇧 United Kingdom");

    const [state, dispatch] = useReducer((cur: SignUpState, payload: Partial<SignUpState>) => {
        return { ...cur, ...payload };
    }, INITIAL_STATE);

    async function createAccount(): Promise<string | undefined> {
        try {
            await axios.post<{ message: string }>(`/api/users`, {
                email: state.emailFirst, 
                username: state.username, 
                password: state.password,
                country: country
            });

            setAccountCreated(true);
            setSignUp(false);
            setErrorMessage("");
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            return errorMessage;
        }
    }

    function openLogIn(): void {
        setSignUp(false);
        setLogIn(true);
    }

    function checkEmail(e: React.ChangeEvent<HTMLInputElement>, isFirst: boolean): void {
        const email = e.target.value;
        const errorMessage = email.match(EMAIL_REGEX) !== null && email.length <= MAX_EMAIL_LENGTH ? "" : "Please use a valid email address.";

        if (!isFirst) {
            dispatch({
                emailSecondErrorMessage: errorMessage !== "" ? errorMessage : email !== state.emailFirst ? "Email address does not match." : "",
                emailSecond: email
            });
        } else {
            dispatch({
                emailFirstErrorMessage: errorMessage, 
                emailFirst: email, 
                emailSecondErrorMessage: state.emailSecond === email ? "" : "Email address does not match."
            });
        }
    }

    function validateUsername(e: React.ChangeEvent<HTMLInputElement>): void {
        const username = e.target.value;
        const error = Validator.validateUsername(username);

        dispatch({
            usernameErrorMessage: error,
            username: username
        });
    }

    function checkPassword(e: React.ChangeEvent<HTMLInputElement>): void {
        const password = e.target.value;
        const error = Validator.validatePassword(password);
        
        dispatch({
            passwordErrorMessage: error,
            password: password
        });
    }

    function isValidForm(): boolean {
        return state.emailFirstErrorMessage === "" && state.emailSecondErrorMessage === "" 
        && state.usernameErrorMessage === "" && state.passwordErrorMessage === "" && state.username !== ""
        && state.password !== "" && state.emailFirst !== "" && state.emailSecond !== "";
    }

    return (
        <PopUpWrapper setIsOpen={setSignUp} title="Create your new account" styles="!max-w-[470px]">
            <div>
                <form>
                    <p className="mb-6 text-side-text-gray text-[16px]">Signing up for FreeFinder is fast and 100% free!</p>
                    {errorMessage !== "" && 
                    <ErrorMessage 
                        message={errorMessage} 
                        title="Account creation failed"
                        setErrorMessage={setErrorMessage}
                    />}
                    <div className="flex flex-col mb-8">
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            className={`search-bar ${state.emailFirstErrorMessage !== "" && state.emailFirst !== "" && "invalid-input"}`} 
                            onChange={(e) => checkEmail(e, true)}
                        />
                        {state.emailFirst !== "" && 
                        <p className="text-box-error-message">
                            {state.emailFirstErrorMessage}
                        </p>}
                        <input 
                            type="email" 
                            placeholder="Confirm your email" 
                            className={`search-bar mt-3 ${state.emailSecondErrorMessage !== "" && state.emailSecond !== "" && "invalid-input"}`} 
                            onChange={(e) => checkEmail(e, false)}
                            onPaste={(e) => {
                                e.preventDefault();
                                return false;
                            }}
                        />
                        {state.emailSecond !== "" && 
                        <p className="text-box-error-message">
                            {state.emailSecondErrorMessage}
                        </p>}
                        <input 
                            type="text" 
                            placeholder="Create a username" 
                            className="search-bar mt-3"
                            value={state.username}
                            onChange={(e) => validateUsername(e)} 
                        />
                        {state.usernameErrorMessage !== "" && state.username !== "" && 
                        <p className="text-box-error-message">
                            {state.usernameErrorMessage}
                        </p>}
                        <input 
                            type="password" 
                            placeholder="Create a password" 
                            className={`search-bar mt-3 ${state.passwordErrorMessage !== "" && state.password !== "" && "invalid-input"}`} 
                            onChange={(e) => checkPassword(e)} 
                        />
                        {state.password !== "" && 
                        <p className="text-box-error-message">
                            {state.passwordErrorMessage}
                        </p>}
                        <div className="mt-3">
                            <CountriesDropdown 
                                country={country}
                                updateCountry={setCountry}
                                text="Country"
                            />
                        </div>
                    </div>
                    <Button
                        action={createAccount}
                        completedText="Account created"
                        defaultText="Create account"
                        loadingText="Checking details"
                        styles={`main-btn ${!isValidForm() ? "invalid-button" : ""}`}
                        textStyles="text-main-white"
                        setErrorMessage={setErrorMessage}
                        loadingSvgSize={28}
                        keepErrorMessage={true}
                    />
                </form>
                <p className="mt-6 text-side-text-gray text-[15px]">Already have an account? 
                    <span className="text-main-blue ml-2 cursor-pointer hover:text-main-black" onClick={openLogIn}>
                        Log In
                    </span>
                </p>
            </div>
        </PopUpWrapper>
    );
}

export default SignUp;