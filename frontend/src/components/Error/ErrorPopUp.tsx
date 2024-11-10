import { useCallback } from "react";
import InfoPopUp from "../common/InfoPopUp";

interface ErrorPopUpProps {
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
    errorMessage: string
}

function ErrorPopUp({ errorMessage, setErrorMessage }: ErrorPopUpProps) {
    const closePopUp = useCallback(() => {
        if (errorMessage !== "") {
            setErrorMessage("");
        }
    }, [setErrorMessage, errorMessage]);

    return (
        <InfoPopUp
            message={errorMessage}
            closePopUp={closePopUp}
            styles="bg-error-text"
        />
    )
}

export default ErrorPopUp;