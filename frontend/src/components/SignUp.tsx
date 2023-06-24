import PopUpWrapper from "../layouts/PopUpWrapper";
import { useState, useRef } from 'react';
import ErrorMessage from "./ErrorMessage";
import CountriesDropdown from "./CountriesDropdown";
import LoadingButton from "./LoadingButton";
import { SignUpForm } from "../types/SignUpForm";

export const emailPattern: RegExp = new RegExp("[a-z0-9]+@[a-zA-Z]+[.][a-z]+$");

const initialFormValues: SignUpForm = {
    emailFirst: "",
    emailSecond: "",
    username: "",
    password: "",
    validEmailFirst: false,
    validEmailSecond: false,
    validUsername: false,
    validPassword: false
}

interface SignUpProps {
    setLogIn: React.Dispatch<React.SetStateAction<boolean>>,
    setSignUp: React.Dispatch<React.SetStateAction<boolean>>,
    setAccountCreated: React.Dispatch<React.SetStateAction<boolean>>
}

function SignUp({ setLogIn, setSignUp, setAccountCreated }: SignUpProps) {
    const [form, setForm] = useState<SignUpForm>(initialFormValues);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const country = useRef<HTMLSelectElement>(null);
    const [loading, setLoading] = useState<boolean>(false);

    async function createAccount(e: React.MouseEvent<HTMLButtonElement>): Promise<void> {
        e.preventDefault();
        if (!country.current || !country.current!.value || loading) {
            return;
        }

        try {
            setLoading(true);
            const response = await fetch("/api/users/register", {
                method: 'POST',
                body: JSON.stringify({ 
                    email: form.emailFirst, 
                    username: form.username, 
                    password: form.password,
                    country: country.current.value
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            const responseData = await response.json();
            if (responseData.message === "success") {
                setAccountCreated(true);
                setSignUp(false);
                setErrorMessage("");
            } else {
                setErrorMessage(responseData.message);
            }
        }
        catch (e: any) {
            setErrorMessage(e.message);
        }
        finally {
            setLoading(false);
        }
    }

    function openLogIn(): void {
        setSignUp(false);
        setLogIn(true);
    }

    function checkEmail(e: React.ChangeEvent<HTMLInputElement>, isFirst: boolean): void {
        const email: string = e.target.value;
        const validEmail: boolean = email.match(emailPattern) !== null;

        if (isFirst) {
            if (validEmail) setForm({ ...form, validEmailFirst: validEmail, emailFirst: email, validEmailSecond: form.emailSecond === email });
            else setForm({ ...form, validEmailFirst: validEmail, emailFirst: email });
        } else {
            setForm({ ...form, validEmailSecond: validEmail && email === form.emailFirst, emailSecond: email });
        }
    }

    function checkUsername(e: React.ChangeEvent<HTMLInputElement>): void {
        const username: string = e.target.value;
        setForm({ ...form, validUsername: username.length > 0, username });
    }

    function checkPassword(e: React.ChangeEvent<HTMLInputElement>): void {
        const password: string = e.target.value;
        setForm({ ...form, validPassword: password.length >= 8, password });
    }

    function isValidForm(): boolean {
        return form.validEmailFirst && form.validEmailSecond 
        && form.validUsername && form.validPassword;
    }

    return (
        <PopUpWrapper setIsOpen={setSignUp} title={"Create your new account"} styles="!max-w-[470px]">
            <form>
                <p className="mb-6 text-side-text-gray text-[16px]">Signing up for FreeFinder is fast and 100% free!</p>
                {errorMessage !== "" && <ErrorMessage message={errorMessage} title={"Account creation failed."} />}
                <div className="flex flex-col mb-8">
                    <input 
                        type="email" 
                        placeholder="Enter your email*" 
                        className={`search-bar ${!form.validEmailFirst && form.emailFirst !== "" && "invalid-input"}`} 
                        onChange={(e) => checkEmail(e, true)}
                    />
                    {!form.validEmailFirst && form.emailFirst !== "" && 
                    <p className="text-box-error-message">
                        Please use a valid email address
                    </p>}
                    <input 
                        type="email" 
                        placeholder="Confirm your email*" 
                        className={`search-bar mt-3 ${!form.validEmailSecond && form.emailSecond !== "" && "invalid-input"}`} 
                        onChange={(e) => checkEmail(e, false)}
                        onPaste={(e) => {
                            e.preventDefault();
                            return false;
                        }}
                    />
                    {!form.validEmailSecond && form.emailSecond !== "" && 
                    <p className="text-box-error-message">
                        Email address does not match
                    </p>}
                    <input type="text" placeholder="Create a username*" className="search-bar mt-3" onChange={(e) => checkUsername(e)} />
                    <input 
                        type="password" 
                        placeholder="Create a password*" 
                        className={`search-bar mt-3 mb-3 ${!form.validPassword && form.password !== "" && "invalid-input"}`} 
                        onChange={(e) => checkPassword(e)} 
                    />
                    <CountriesDropdown country={country} selected={"🇬🇧 United Kingdom"} />
                </div>
                <LoadingButton
                    loading={loading} text="Create Account" loadingText="Checking details" 
                    callback={createAccount} styles={!isValidForm() ? "invalid-button main-btn" : "main-btn"} 
                    disabled={!isValidForm()} loadingColour="bg-main-black"
                />
                <p className="mt-6 text-side-text-gray text-[15px]">Already have an account? 
                    <span className="text-main-blue ml-2 cursor-pointer hover:text-main-black" onClick={openLogIn}>
                        Log In
                    </span>
                </p>
            </form>
        </PopUpWrapper>
    );
}

export default SignUp;