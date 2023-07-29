import { FileData } from "./FileData";

export type FailedUpload = {
    fileData: FileData,
    errorMessage: string
}