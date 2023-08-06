import { SUPPORTED_FORMATS } from "../components/SupportedFileFormats";

export function checkFileType(file: File, maxBytes: number): boolean {
    return SUPPORTED_FORMATS.some((format) => file.type.startsWith(format)) && file.size <= maxBytes;
}