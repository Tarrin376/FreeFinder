import { useState, useContext } from 'react';
import ErrorMessage from "../../components/ErrorMessage";
import CountriesDropdown from "../../components/CountriesDropdown";
import { fetchUpdatedUser } from "../../utils/fetchUpdatedUser";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";
import { AxiosError } from "axios";
import Button from "../../components/Button";
import { UserContext } from '../../providers/UserContext';

function UserProfile() {
    const userContext = useContext(UserContext);
    const [username, setUsername] = useState<string>(userContext.userData.username);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [country, setCountry] = useState<string>(userContext.userData.country);
    
    async function updateProfile(): Promise<string | undefined> {
        try {
            const updated = await fetchUpdatedUser({ 
                ...userContext.userData, 
                username, 
                country: country 
            }, userContext.userData.username);

            userContext.setUserData(updated.userData);
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            return errorMessage;
        }
    }

    return (
        <>
            <h1 className="text-[20px]">Profile</h1>
            <p className="text-side-text-gray mt-1 pb-4 border-b border-b-nav-search-gray">
                Customize your profile
            </p>
            <div className="flex mt-7 flex-col gap-4">
                <div>
                    {errorMessage !== "" && 
                    <ErrorMessage 
                        message={errorMessage} 
                        title="Failed to update username"
                        setErrorMessage={setErrorMessage}
                    />}
                    <p className="mb-2">Username</p>
                    <input 
                        type="text" 
                        name="change-username" 
                        className={`search-bar ${username === "" && "invalid-input"}`} 
                        value={username} onChange={(e) => setUsername(e.target.value)} 
                        maxLength={20}
                    />
                    <p className="text-box-error-message">
                        {username === "" ? "Username cannot be empty" : ""}
                    </p>
                </div>
                <div>
                    <p className="mb-2">Country</p>
                    <CountriesDropdown 
                        country={country}
                        setCountry={setCountry} 
                        title="Country"
                    />
                </div>
                <Button
                    action={updateProfile}
                    completedText="Profile updated successfully"
                    defaultText="Update profile"
                    loadingText="Checking details"
                    styles={username === "" ? "invalid-button main-btn mt-3" : "mt-3 main-btn"}
                    textStyles="text-main-white"
                    setErrorMessage={setErrorMessage}
                    keepErrorMessage={true}
                    loadingSvgSize="28px"
                />
            </div>
        </>
    );
}

export default UserProfile;