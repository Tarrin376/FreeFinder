import { SUPPORTED_IMAGE_FORMATS } from "@freefinder/shared/dist/constants";

export function checkImageType(file: File, maxBytes: number): boolean {
    if (!file.type.startsWith("image/")) {
        return false;
    }

    const type = file.type.substring(6);
    return SUPPORTED_IMAGE_FORMATS.includes(type) && file.size <= maxBytes;
}