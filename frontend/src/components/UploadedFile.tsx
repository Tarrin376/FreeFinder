import CloseSvg from "./CloseSvg";
import FileTypeIcon from "./FileTypeIcon";
import { ChatBoxState } from "./ChatBox";
import { FileData } from "../types/FileData";

interface UploadedFileProps {
    fileData: FileData,
    dispatch: React.Dispatch<Partial<ChatBoxState>>,
    uploadedFiles: FileData[]
}

function UploadedFile({ fileData, dispatch, uploadedFiles }: UploadedFileProps) {
    function removeFile() {
        dispatch({ uploadedFiles: uploadedFiles.filter((x: FileData) => x !== fileData) });
    }

    return (
        <div className="flex justify-between items-center gap-4 border border-light-border-gray rounded-full px-3 py-1 overflow-hidden">
            <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-[20px] h-full">
                    <FileTypeIcon file={fileData.file} />
                </div>
                <span className="text-side-text-gray text-sm text-ellipsis overflow-hidden whitespace-nowrap">
                    {fileData.file.name}
                </span>
            </div>
            <CloseSvg 
                size={17} 
                colour="#8d8c91" 
                action={removeFile}
            />
        </div>
    )
}

export default UploadedFile;