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
    const [successMessage, setSuccessMessage] = useState<string>("");

    async function saveSeller(): Promise<void> {
        try {
            const resp = await axios.post<{ message: string }>(`/api/users/${userContext.userData.username}/saved/sellers/${sellerID}`);
            actionFinished(setSuccessMessage, resp.data.message, "");
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
            hoverText="Save seller"
        />
    )
}

export default SaveSeller;