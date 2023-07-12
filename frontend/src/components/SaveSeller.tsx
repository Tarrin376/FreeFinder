import { useContext, useState } from "react";
import { UserContext } from "../providers/UserContext";
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from "../utils/getAPIErrorMessage";
import { actionFinished } from "../utils/actionFinished";
import Save from "./Save";

interface SaveSellerProps {
    svgSize: number,
    sellerID: string
}

function SaveSeller({ svgSize, sellerID }: SaveSellerProps) {
    const userContext = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState<string>("");

    async function saveSeller(checked: boolean): Promise<void> {
        let response = null;
        try {
            if (checked) {
                response = await axios.delete<{ savedSellers: string[], message: string }>
                (`/api/users/${userContext.userData.username}/saved/sellers/${sellerID}`);
            } else {
                response = await axios.post<{ savedSellers: string[], message: string }>
                (`/api/users/${userContext.userData.username}/saved/sellers/${sellerID}`);
            }

            userContext.setUserData({
                ...userContext.userData,
                savedSellers: new Set(response.data.savedSellers)
            });
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            actionFinished(setErrorMessage, errorMessage, "");
        }
    }
    
    return (
        <Save
            action={saveSeller}
            svgSize={svgSize}
            checked={userContext.userData.savedSellers.has(sellerID)}
            hoverText={userContext.userData.savedSellers.has(sellerID) ? "Unsave seller" : "Save seller"}
        />
    )
}

export default SaveSeller;