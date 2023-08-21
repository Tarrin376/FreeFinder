export async function checkFiles(files: FileList, uploadedFiles: File[], maxBytes: number, maxFileUploads: number, 
    checkFile?: (file: File, maxBytes: number) => boolean): Promise<{
    failed: number,
    allFiles: File[]
}> {
    let filesToAdd: number = Math.min(maxFileUploads - uploadedFiles.length, files.length);
    const uploaded: File[] = [];

    let index = 0;
    let failed = 0;

    while (index < files.length && filesToAdd > 0) {
        const validFile: boolean = checkFile ? checkFile(files[index], maxBytes) : true;
        if (validFile) {
            uploaded.push(files[index]);
            filesToAdd--;
        } else {
            failed++;
        }

        index++;
    }
    
    const allFiles: File[] = [...uploadedFiles, ...uploaded];
    return {
        failed: failed,
        allFiles: allFiles
    };
}