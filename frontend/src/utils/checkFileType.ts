import { SUPPORTED_FILE_FORMATS } from "@freefinder/shared/dist/constants";

export function checkFileType(file: File, maxBytes: number): boolean {
    return Object.keys(SUPPORTED_FILE_FORMATS).some((format) => file.type.startsWith(format)) && file.size <= maxBytes;
}