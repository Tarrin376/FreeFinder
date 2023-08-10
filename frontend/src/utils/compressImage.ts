import imageCompression, { Options } from "browser-image-compression";
import { parseFileBase64 } from "./parseFileBase64";

const imageCompressionOptions: Options = {
    maxSizeMB: 1,
    useWebWorker: true,
    maxWidthOrHeight: 1920,
    fileType: "image/webp"
}

export async function compressImage(image: File): Promise<unknown> {
    try {
        return await parseFileBase64(await imageCompression(image, imageCompressionOptions));
    }
    catch (err) {
        throw new Error("Failed to compress image.");
    }
}