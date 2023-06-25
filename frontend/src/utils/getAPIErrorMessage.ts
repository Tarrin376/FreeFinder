import { AxiosError } from "axios";

export function getAPIErrorMessage(error: AxiosError<{ message: string }>): string {
    if (!error.response) {
        return "Something went wrong when trying to process your request.";
    } else {
        return error.response.data.message;
    }
}