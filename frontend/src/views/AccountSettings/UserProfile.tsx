import { IUserContext } from "../../context/UserContext";
import { useState, useRef } from 'react';
import ErrorMessage from "../../components/ErrorMessage";
import CountriesDropdown from "../../components/CountriesDropdown";
import LoadingButton from "../../components/LoadingButton";
import { fetchUpdatedUser } from "../../utils/fetchUpdatedUser";
import { UpdateResponse } from "../../utils/fetchUpdatedUser";
import { actionSuccessful } from "../../utils/actionSuccessful";

function UserProfile({  userContext }: { userContext: IUserContext }) {
    const [username, setUsername] = useState<string>(userContext.userData.username);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const country = useRef<HTMLSelectElement>(null);
    const [completed, setCompleted] = useState<boolean>(false);
    
    async function updateProfile(): Promise<void> {
        try {
            if (!country.current || !country.current!.value) {
                return;
            }

            setLoading(true);
            const updated: UpdateResponse = await fetchUpdatedUser({ 
                ...userContext.userData, 
                username, 
                country: country.current!.value 
            });

            if (updated.message === "success" && updated.userData) {
                userContext.setUserData(updated.userData);
                setErrorMessage("");
                actionSuccessful(setCompleted, true, false);
            } else {
                setErrorMessage(updated.message);
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
        <>
            <h1 className="text-[23px]">Profile</h1>
            <p className="text-side-text-gray mt-1 pb-4 border-b border-b-nav-search-gray">
                Customize your profile
            </p>
            <div className="flex mt-7 flex-col gap-4">
                <div>
                    {errorMessage !== "" && <ErrorMessage message={errorMessage} title="Failed to update username" />}
                    <p className="mb-2">Username</p>
                    <input type="text" name="change-username" className={`search-bar ${username === "" && "invalid-input"}`} 
                    value={username} onChange={(e) => setUsername(e.target.value)} />
                    <p className="text-box-error-message">
                        {username === "" ? "Username cannot be empty" : ""}
                    </p>
                </div>
                <div>
                    <p className="mb-2">Country</p>
                    <CountriesDropdown country={country} selected={userContext.userData.country} />
                </div>
                <LoadingButton 
                    loading={loading} text="Update Profile" loadingText="Checking username" 
                    callback={updateProfile} styles={username === "" ? "invalid-button main-btn mt-3" : "mt-3 main-btn"}
                    disabled={username === ""} loadingColour="bg-main-black" completed={completed} 
                    completedText="Profile updated successfully"
                />
            </div>
        </>
    );
}

export default UserProfile;