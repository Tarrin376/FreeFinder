import { motion } from "framer-motion";
import { useRef } from "react";
import DragAndDrop from "./DragAndDrop";
import StorageIcon from "../assets/storage.png";
import { parseFileBase64 } from "../utils/parseFileBase64";
import { FileData } from "../types/FileData";
import { ChatBoxState } from "./ChatBox";

const MAX_FILE_UPLOADS = 10;
const MAX_FILE_BYTES = 5000000;

interface AttachFileProps {
    uploadedFiles: FileData[],
    dispatch: React.Dispatch<Partial<ChatBoxState>>
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>
}

function AttachFiles({ uploadedFiles, dispatch, setErrorMessage }: AttachFileProps) {
    const fileRef = useRef<HTMLInputElement>(null);

    async function handleDrop(files: FileList): Promise<void> {
        let filesToAdd: number = Math.min(MAX_FILE_UPLOADS - uploadedFiles.length, files.length);
        let uploaded: FileData[] = [];
        let index = 0, failed = 0;

        while (index < files.length && filesToAdd > 0) {
            if (files[index].size > MAX_FILE_BYTES) {
                failed++;
                index++;
                continue;
            }

            try {
                const base64Str = await parseFileBase64(files[index]);
                uploaded.push({
                    file: files[index],
                    base64Str: base64Str
                });
            }
            catch (_: any) {
                failed++;
            }

            index++;
        }

        if (failed > 0) {
            setErrorMessage(`Failed to upload ${failed} files. Please ensure that each file does not 
            exceed ${MAX_FILE_BYTES / 1000000}MB in size.`);
        } else {
            setErrorMessage("");
        }

        dispatch({
            uploadedFiles: [...uploadedFiles, ...uploaded]
        });
    }

    function triggerFileUpload(): void {
        if (fileRef.current) {
            fileRef.current.click();
        }
    }

    function uploadFile(): void {
        if (fileRef.current && fileRef.current.files) {
            handleDrop(fileRef.current.files);
        }
    }

    return (
        <motion.div className="absolute bottom-[calc(100%-30px)] right-[14px] z-20 border border-light-border-gray rounded-[8px]
        bg-main-white w-[300px] h-[300px] flex flex-col justify-between gap-3 p-3 shadow-post" 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
            <DragAndDrop handleDrop={handleDrop} styles="!rounded-[6px]">
                <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                    <img src={StorageIcon} className="block m-auto w-[35px] h-[35px] mb-3" alt="storage" />
                    <p className="text-center text-sm">Drag and Drop files here</p>
                </div>
            </DragAndDrop>
            <div className="flex items-center justify-between gap-5">
                <input type="file" className="hidden" ref={fileRef} onChange={uploadFile} />
                <p className="text-side-text-gray text-sm">{`0 / ${MAX_FILE_UPLOADS} files uploaded`}</p>
                <button className="main-btn w-fit !h-[33px] text-[15px]" onClick={triggerFileUpload}>
                    Upload file
                </button>
            </div>
        </motion.div>
    )
}

export default AttachFiles;