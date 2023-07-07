import { useEffect, useState } from "react";
import { SellerProfile } from "../../types/SellerProfile";
import axios, { AxiosError } from "axios";
import { useLocation } from "react-router-dom";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";
import { useNavigateErrorPage } from "../../hooks/useNavigateErrorPage";

function SellerProfileView() {
    const [sellerDetails, setSellerDetails] = useState<SellerProfile>();
    const [errorMessage, setErrorMessage] = useState<string>("");
    const location = useLocation();

    useNavigateErrorPage("Uh oh! Failed to retrieve seller...", errorMessage);

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get<{ sellerDetails: SellerProfile, message: string }>(`/api${location.pathname}`);
                setSellerDetails(response.data.sellerDetails);
            }
            catch (err: any) {
                const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
                setErrorMessage(errorMessage);
            }
        })();
    }, [location.pathname]);

    return (
        <div></div>
    )
}

export default SellerProfileView;