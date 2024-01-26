import { motion } from "framer-motion";
import { useRef } from "react";
import DragAndDrop from "./DragAndDrop";
import StorageIcon from "../../assets/storage.png";
import { checkFiles } from "../../utils/checkFiles";
import { checkFileType } from "../../utils/checkFileType";
import { MAX_FILE_BYTES, MAX_MESSAGE_FILE_UPLOADS } from "@freefinder/shared/dist/constants";
import { getUniqueArray } from "src/utils/getUniqueArray";

interface AttachFileProps {
    uploadedFiles: File[],
    updateUploadedFiles: (files: File[]) => void,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>
}

function AttachFiles({ uploadedFiles, updateUploadedFiles, setErrorMessage }: AttachFileProps) {
    const fileRef = useRef<HTMLInputElement>(null);

    async function handleDrop(files: FileList): Promise<void> {
        const { failed, allFiles } = await checkFiles(files, uploadedFiles, MAX_FILE_BYTES, MAX_MESSAGE_FILE_UPLOADS, checkFileType);
        const uniqueFiles = getUniqueArray<File, string>(allFiles, x => x.name);

        if (failed > 0) {
            setErrorMessage(`Failed to upload ${failed} ${failed === 1 ? "file" : "files"}. 
            Files must use a supported file format and should not exceed ${MAX_FILE_BYTES / 1000000}MB in size.`);
        } else {
            setErrorMessage("");
        }

        updateUploadedFiles(uniqueFiles);
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
        bg-main-white w-[250px] h-[250px] flex flex-col justify-between gap-3 p-3 shadow-pop-up" 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
            <DragAndDrop handleDrop={handleDrop} styles="!rounded-[6px]">
                <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                    <img src={StorageIcon} className="block m-auto w-[35px] h-[35px] mb-3" alt="storage" />
                    <p className="text-center text-sm">
                        Drag and Drop files here
                    </p>
                </div>
            </DragAndDrop>
            <div>
                <input type="file" className="hidden" ref={fileRef} onChange={uploadFile} />
                <p className="text-side-text-gray text-sm mb-3">Files uploaded:
                    <span className={`${uploadedFiles.length === MAX_MESSAGE_FILE_UPLOADS ? 'text-error-text' : 'text-light-green'} text-sm`}>
                        {` ${uploadedFiles.length} / ${MAX_MESSAGE_FILE_UPLOADS}`}
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