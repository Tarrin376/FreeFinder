export function checkFile(file: File, maxBytes: number): boolean {
    return (file.type === "image/jpeg" || file.type === "image/png") && file.size <= maxBytes;
}