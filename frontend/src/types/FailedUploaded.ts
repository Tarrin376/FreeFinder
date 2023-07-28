import { FileData } from "./FileData";

export type FailedUpload = {
    imageData: FileData,
    errorMessage: string
}