import PopUpWrapper from "../wrappers/PopUpWrapper";
import { useState, useContext } from 'react';
import { IUserContext, UserContext } from "../providers/UserContext";
import ErrorMessage from "./ErrorMessage";
import axios, { AxiosError } from "axios";
import { ISeller } from "../models/ISeller";
import { getAPIErrorMessage } from "../utils/getAPIErrorMessage";
import Button from "./Button";
import SearchLanguages from "./SearchLanguages";

const MAX_DESC_CHARS = 250;

interface SellerProfileProps {
    setSellerProfilePopUp: React.Dispatch<React.SetStateAction<boolean>>,
}

function SellerProfile({ setSellerProfilePopUp }: SellerProfileProps) {
    const [description, setDescription] = useState<string>("");
    const userContext = useContext<IUserContext>(UserContext);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>(userContext.userData.seller?.languages ? userContext.userData.seller.languages : []);
    
    function closeSellerProfilePopUp(): void {
        setSellerProfilePopUp(false);
    }

    async function updateSellerDetails(): Promise<string | undefined> {
        try {
            const resp = await axios.put<{ updatedData: ISeller, message: string }>(`/api/sellers/${userContext.userData.username}`, {
                description: description,
                languages: selectedLanguages
            });

            userContext.setUserData({ 
                ...userContext.userData, 
                seller: { ...resp.data.updatedData }
            });
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            return errorMessage;
        }
    }

    return (
        <PopUpWrapper setIsOpen={setSellerProfilePopUp} title={"Seller Profile"}>
            {errorMessage !== "" && 
            <ErrorMessage 
                message={errorMessage} 
                title={"Unable to update seller profile"} 
            />}
            <p className="mb-2">
                Seller description 
                <span className="text-side-text-gray">
                    {` (Max ${MAX_DESC_CHARS} characters)`}
                </span>
            </p>
            <textarea rows={7} className="search-bar mb-4" defaultValue={userContext.userData.seller?.description} 
            maxLength={MAX_DESC_CHARS} onChange={(e) => setDescription(e.target.value)} />
            <p className="mb-2">Languages you speak</p>
            <SearchLanguages 
                setSelectedLanguages={setSelectedLanguages} 
                selectedLanguages={selectedLanguages} 
            />
            <Button
                action={updateSellerDetails}
                completedText="Seller profile updated"
                defaultText="Update seller profile"
                loadingText="Updating seller profile"
                styles={`main-btn mt-[35px] ${selectedLanguages.length === 0 ? "invalid-button" : ""}`}
                textStyles="text-main-white"
                setErrorMessage={setErrorMessage}
                whenComplete={closeSellerProfilePopUp}
            />
        </PopUpWrapper>
    );
}

export default SellerProfile;