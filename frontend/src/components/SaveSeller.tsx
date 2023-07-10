import { useContext, useState } from "react";
import { UserContext } from "../providers/UserContext";
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from "../utils/getAPIErrorMessage";
import { actionFinished } from "../utils/actionFinished";

interface SaveSellerProps {
    svgSize: number,
    sellerID: string
}

function SaveSeller({ svgSize, sellerID }: SaveSellerProps) {
    const userContext = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [saved, setSaved] = useState<boolean>(false);

    async function saveSeller(): Promise<void> {
        try {
            setSaved(true);
            const resp = await axios.post<{ message: string }>(`/api/users/${userContext.userData.username}/saved/sellers/${sellerID}`);
            actionFinished(setSuccessMessage, resp.data.message, "");
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            actionFinished(setErrorMessage, errorMessage, "");
        }
        finally {
            setSaved(false);
        }
    }
    
    return (
        <div className="relative">
            <svg
                onClick={saveSeller}
                viewBox="0 0 32 32" 
                xmlns="http://www.w3.org/2000/svg" 
                className="block fill-[#00000086] stroke-white stroke-2 cursor-pointer"
                style={{ width: svgSize, height: svgSize, scale: saved ? '0.90' : '1' }}
                aria-hidden="true" 
                role="presentation" 
                focusable="false">
                <path d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z">
                </path>
            </svg>
        </div>
    )
}

export default SaveSeller;