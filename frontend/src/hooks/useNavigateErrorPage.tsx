import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useNavigateErrorPage(title: string, errorMessage: string) {
    const navigate = useNavigate();

    useEffect(() => {
        if (errorMessage !== "") {
            navigate("/error", { state: { title: title, errorMessage: errorMessage,  } });
        }
    }, [errorMessage, navigate, title]);
}