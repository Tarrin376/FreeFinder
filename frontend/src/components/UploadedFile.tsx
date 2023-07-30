import CloseSvg from "./CloseSvg";
import { ChatBoxState } from "./ChatBox";
import { FileData } from "../types/FileData";
import File from "./File";

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
        <File fileType={fileData.file.type} fileName={fileData.file.name}>
            <CloseSvg 
                size={17} 
                colour="#8d8c91" 
                action={removeFile}
            />
        </File>
    )
}

export default UploadedFile;