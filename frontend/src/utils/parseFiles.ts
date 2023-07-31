import { FileData } from "../types/FileData";
import { getUniqueArray } from "./getUniqueArray";
import { parseFileBase64 } from "./parseFileBase64";

export async function parseFiles(files: FileList, uploadedFiles: FileData[], maxBytes: number, maxFileUploads: number, 
    checkFile?: (file: File, maxBytes: number) => boolean): Promise<{
    failed: number,
    allFiles: FileData[]
}> {
    let filesToAdd: number = Math.min(maxFileUploads - uploadedFiles.length, files.length);
    const uploaded: FileData[] = [];
    let index = 0;
    let failed = 0;

    while (index < files.length && filesToAdd > 0) {
        const validFile: boolean = checkFile ? checkFile(files[index], maxBytes) : true;
        if (validFile) {
            try {
                const base64Str = await parseFileBase64(files[index]);
                uploaded.push({
                    file: files[index],
                    base64Str: base64Str
                });
                filesToAdd--;
            }
            catch (_: any) {
                failed++;
            }
        } else {
            failed++;
        }

        index++;
    }
    
    const allFiles: FileData[] = [...uploadedFiles, ...getUniqueArray<FileData, unknown>(uploaded, (x: FileData) => x.base64Str)];
    const uniqueFiles: FileData[] = getUniqueArray<FileData, unknown>(allFiles, (x: FileData) => x.base64Str);

    return {
        failed: failed,
        allFiles: uniqueFiles
    }
}