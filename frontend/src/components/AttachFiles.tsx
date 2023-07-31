import { motion } from "framer-motion";
import { useRef } from "react";
import DragAndDrop from "./DragAndDrop";
import StorageIcon from "../assets/storage.png";
import { FileData } from "../types/FileData";
import { ChatBoxState } from "./ChatBox";
import { parseFiles } from "../utils/parseFiles";
import { checkFileType } from "../utils/checkFileType";

const MAX_FILE_UPLOADS = 3;
const MAX_FILE_BYTES = 5000000;

interface AttachFileProps {
    uploadedFiles: FileData[],
    dispatch: React.Dispatch<Partial<ChatBoxState>>
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>
}

function AttachFiles({ uploadedFiles, dispatch, setErrorMessage }: AttachFileProps) {
    const fileRef = useRef<HTMLInputElement>(null);

    async function handleDrop(files: FileList): Promise<void> {
        const { failed, allFiles } = await parseFiles(files, uploadedFiles, MAX_FILE_BYTES, MAX_FILE_UPLOADS, checkFileType);

        if (failed > 0) {
            setErrorMessage(`Failed to upload ${failed} ${failed === 1 ? "file" : "files"}. 
            Files must use a supported file format and should not exceed ${MAX_FILE_BYTES / 1000000}MB in size.`);
        } else {
            setErrorMessage("");
        }

        dispatch({ uploadedFiles: allFiles });
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
        bg-main-white w-[300px] h-[300px] flex flex-col justify-between gap-3 p-3 shadow-pop-up" 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
            <DragAndDrop handleDrop={handleDrop} styles="!rounded-[6px]">
                <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                    <img src={StorageIcon} className="block m-auto w-[35px] h-[35px] mb-3" alt="storage" />
                    <p className="text-center text-sm">Drag and Drop files here</p>
                </div>
            </DragAndDrop>
            <div className="flex items-center justify-between gap-5">
                <input type="file" className="hidden" ref={fileRef} onChange={uploadFile} />
                <p className="text-side-text-gray text-sm">Files uploaded:
                    <span className={`${uploadedFiles.length === MAX_FILE_UPLOADS ? 'text-error-text' : 'text-light-green'} text-sm`}>
                        {` ${uploadedFiles.length} / ${MAX_FILE_UPLOADS}`}
                    </span>
                </p>
                <button className="main-btn w-fit !h-[33px] text-[15px]" onClick={triggerFileUpload}>
                    Upload file
                </button>
            </div>
        </motion.div>
    )
}

export default AttachFiles;