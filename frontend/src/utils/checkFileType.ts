export const SUPPORTED_FILE_FORMATS = [
    'image',
    'video',
    'audio',
    'raw',
    'text/csv',
    'text/plain',
    'application/json',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

export function checkFileType(file: File, maxBytes: number): boolean {
    return SUPPORTED_FILE_FORMATS.some((format) => file.type.startsWith(format)) && file.size <= maxBytes;
}