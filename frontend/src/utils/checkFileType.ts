import { supportedFormats } from "../components/SupportedFileFormats";

export function checkFileType(file: File, maxBytes: number): boolean {
    return supportedFormats.some((format) => file.type.startsWith(format)) && file.size <= maxBytes;
}