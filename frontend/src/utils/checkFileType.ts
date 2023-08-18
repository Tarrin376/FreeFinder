export const SUPPORTED_FILE_FORMATS: Record<string, string> = {
    "image" : "image",
    "video": "video",
    "audio": "audio",
    "text/csv": "csv",
    "text/plain": "txt",
    "application/json": "json",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/vnd.ms-powerpoint": "ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx"
}

export function checkFileType(file: File, maxBytes: number): boolean {
    return Object.keys(SUPPORTED_FILE_FORMATS).some((format) => file.type.startsWith(format)) && file.size <= maxBytes;
}