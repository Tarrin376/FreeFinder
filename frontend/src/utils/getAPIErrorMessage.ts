import { AxiosError } from "axios";

export function getAPIErrorMessage(error: AxiosError<{ message: string }>): string {
    if (!error.response) {
        return "Something went wrong. Please try again.";
    } else {
        return error.response.data.message;
    }
}