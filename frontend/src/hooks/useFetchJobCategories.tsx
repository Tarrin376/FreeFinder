import { IJobCategory } from "../models/IJobCategory";
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from "../utils/getAPIErrorMessage";

export function useFetchJobCategories(): {
    categories: IJobCategory[],
    errorMessage: string,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>
} {
    const [categories, setCategories] = useState<IJobCategory[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const resp = await axios.get<{ jobCategories: IJobCategory[], message: string }>(`/api/job-categories`);
                setCategories(resp.data.jobCategories);
            }
            catch (err: any) {
                const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
                setErrorMessage(errorMessage);
            }
        })()
    }, [setErrorMessage]);

    return {
        categories,
        errorMessage,
        setErrorMessage
    };
}