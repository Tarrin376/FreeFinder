import imageCompression, { Options } from "browser-image-compression";

const imageCompressionOptions: Options = {
    maxSizeMB: 1,
    useWebWorker: true,
    maxWidthOrHeight: 1920
}

export async function compressImage(image: File): Promise<File> {
    try {
        const file = await imageCompression(image, imageCompressionOptions);
        return file;
    }
    catch (err) {
        throw new Error("Only image files allowed.");
    }
}