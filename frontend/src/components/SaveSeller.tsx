import { useContext, useState } from "react";
import { UserContext } from "../providers/UserProvider";
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from "../utils/getAPIErrorMessage";
import { actionFinished } from "../utils/actionFinished";
import Save from "./Save";
import ErrorPopUp from "./ErrorPopUp";
import { AnimatePresence } from "framer-motion";

interface SaveSellerProps {
    svgSize: number,
    sellerID: string,
    isSaved?: boolean,
    action?: (saved: boolean) => Promise<void>,
    hideSaveMessage?: boolean
}

function SaveSeller({ svgSize, sellerID, isSaved, action, hideSaveMessage }: SaveSellerProps) {
    const userContext = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState<string>("");

    async function saveSeller(saved: boolean): Promise<void> {
        try {
            if (saved) {
                await axios.delete<{ message: string }>(`/api/users/${userContext.userData.username}/saved/sellers/${sellerID}`);
            } else {
                await axios.post<{ message: string }>(`/api/users/${userContext.userData.username}/saved/sellers/${sellerID}`);
            }
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            actionFinished(setErrorMessage, errorMessage, "");
        }
    }
    
    return (
        <>
            <AnimatePresence>
                {errorMessage !== "" &&
                <ErrorPopUp
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                />}
            </AnimatePresence>
            <Save
                action={action ?? saveSeller}
                svgSize={svgSize}
                hoverText="seller"
                isSaved={isSaved}
                hideSaveMessage={hideSaveMessage}
            />
        </>
    )
}

export default SaveSeller;