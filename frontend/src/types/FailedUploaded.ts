import { ImageData } from "./ImageData"

export type FailedUpload = {
    imageData: ImageData,
    index: number,
    errorMessage: string
}