import PopUpWrapper from "../layouts/PopUpWrapper";
import { useState, useRef } from 'react';
import ErrorMessage from "./ErrorMessage";
import CountriesDropdown from "./CountriesDropdown";
import LoadingButton from "./LoadingButton";

interface SignUpProps {
    setLogIn: React.Dispatch<React.SetStateAction<boolean>>,
    setSignUp: React.Dispatch<React.SetStateAction<boolean>>,
    setAccountCreated: React.Dispatch<React.SetStateAction<boolean>>
}

export const emailPattern: RegExp = new RegExp("[a-z0-9]+@[a-zA-Z]+[.][a-z]+$");

const initialFormValues = {
    emailFirst: "",
    emailSecond: "",
    username: "",
    password: "",
    validEmailFirst: false,
    validEmailSecond: false,
    validUsername: false,
    validPassword: false
}

function SignUp({ setLogIn, setSignUp, setAccountCreated }: SignUpProps) {
    const [form, setForm] = useState(initialFormValues);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const country = useRef<HTMLSelectElement>(null);
    const [loading, setLoading] = useState<boolean>(false);

    async function createAccount(e: React.MouseEvent<HTMLButtonElement>): Promise<void> {
        e.preventDefault();
        if (!country || !country.current || loading) {
            return;
        }

        setLoading(true);
        const addAttempt = await fetch('/user/createUser', {
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
        })
        .then((res) => {
            return res.json();
        })
        .catch(() => {
            setErrorMessage(`An unexpected error occured when trying to create your account. 
            Make sure you are connected to the internet and try again.`);
        });

        if (addAttempt.status === 200) {
            setAccountCreated(true);
            setSignUp(false);
            setErrorMessage("");
        } else {
            setErrorMessage(addAttempt.message);
        }

        setLoading(false);
    }

    function openLogIn(): void {
        setSignUp(false);
        setLogIn(true);
    }

    function checkEmail(e: React.ChangeEvent<HTMLInputElement>, isFirst: boolean): void {
        const email: string = e.target.value;
        const validEmail: boolean = email.match(emailPattern) !== null;

        if (isFirst) {
            setForm({ ...form, validEmailFirst: validEmail, emailFirst: email });
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

    function isValidInput(valid: boolean, value: string): boolean {
        return valid || value === "";
    }

    function isValidForm(): boolean {
        return form.validEmailFirst && form.validEmailSecond 
        && form.validUsername && form.validPassword;
    }

    return (
        <PopUpWrapper setIsOpen={setSignUp}>
            <form>
                <h1 className="text-[26px] mb-2">Let's create your new account</h1>
                <p className="mb-6 text-side-text-gray text-[15px]">Signing up for FreeFinder is fast and 100% free!</p>
                {errorMessage !== "" && <ErrorMessage message={errorMessage} title={"Account creation failed."} />}
                <div className="flex gap-3 flex-col mb-8">

                    <input type="email" placeholder="Enter your email*" 
                    className={`search-bar ${!isValidInput(form.validEmailFirst, form.emailFirst) && "invalid-input"}`} 
                    onChange={(e) => checkEmail(e, true)} />

                    <input type="email" placeholder="Confirm your email*" 
                    className={`search-bar ${!isValidInput(form.validEmailSecond, form.emailSecond) && "invalid-input"}`} 
                    onChange={(e) => checkEmail(e, false)} />

                    <input type="text" placeholder="Create a username*" 
                    className={`search-bar ${!isValidInput(form.validUsername, form.username) && "invalid-input"}`} 
                    onChange={(e) => checkUsername(e)} />

                    <input type="password" placeholder="Create a password*" 
                    className={`search-bar ${!isValidInput(form.validPassword, form.password) && "invalid-input"}`} 
                    onChange={(e) => checkPassword(e)} />
                    <CountriesDropdown country={country} selected={"🇬🇧 United Kingdom"} />
                </div>

                <LoadingButton
                    loading={loading} text="Create Account" loadingText="Checking details" 
                    callback={createAccount} styles={!isValidForm() ? "invalid-button" : ""} 
                    disabled={!isValidForm()} 
                />
                
                <p className="mt-6 text-side-text-gray text-[15px]">Already have an account? 
                    <span className="text-main-red ml-2 cursor-pointer hover:text-main-black" onClick={openLogIn}>
                        Log In
                    </span>
                </p>
            </form>
        </PopUpWrapper>
    );
}

export default SignUp;