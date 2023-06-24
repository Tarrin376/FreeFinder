import PopUpWrapper from "../layouts/PopUpWrapper";
import LoadingButton from "./LoadingButton";
import { useState, useContext } from 'react';
import { IUserContext, UserContext } from "../context/UserContext";
import ErrorMessage from "./ErrorMessage";

const MAX_DESC_CHARS = 250;

interface SellerProfileProps {
    setSellerProfilePopUp: React.Dispatch<React.SetStateAction<boolean>>,
}

function SellerProfile({ setSellerProfilePopUp }: SellerProfileProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [description, setDescription] = useState<string>("");
    const userContext = useContext<IUserContext>(UserContext);
    const [errorMessage, setErrorMessage] = useState<string>("");

    async function updateSellerDetails(): Promise<void> {
        setLoading(true);
        try {
            const response = await fetch("/api/sellers/update", {
                method: 'PUT',
                body: JSON.stringify({
                    description: description,
                    userID: userContext.userData.userID
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            const responseData = await response.json();
            if (responseData.message === "success") {
                userContext.setUserData({ ...userContext.userData, seller: { ...responseData.updatedData }});
                setSellerProfilePopUp(false);
            } else {
                setErrorMessage(responseData.message);
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
        <PopUpWrapper setIsOpen={setSellerProfilePopUp} title={"Seller Profile"}>
            {errorMessage !== "" && <ErrorMessage message={errorMessage} title={"Unable to update seller profile"} />}
            <p className="mb-2">
                Seller description 
                <span className="text-side-text-gray">
                    {` (Max ${MAX_DESC_CHARS} characters)`}
                </span>
            </p>
            <textarea rows={7} className="search-bar mb-3" defaultValue={userContext.userData.seller.description} 
            maxLength={MAX_DESC_CHARS} onChange={(e) => setDescription(e.target.value)} />
            <LoadingButton 
                loading={loading} text={"Update Seller Profile"} 
                loadingText={"Updating seller profile"} callback={updateSellerDetails}
                disabled={loading} loadingColour={'bg-main-black'} styles={'main-btn mt-5'}
            />
        </PopUpWrapper>
    );
}

export default SellerProfile;