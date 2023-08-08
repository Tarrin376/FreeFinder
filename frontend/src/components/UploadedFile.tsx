import CloseSvg from "./CloseSvg";
import { FileData } from "../types/FileData";
import File from "./File";

interface UploadedFileProps {
    fileData: FileData,
    removeFile: (file: FileData) => void,
}

function UploadedFile({ fileData, removeFile }: UploadedFileProps) {
    return (
        <File fileType={fileData.file.type} fileName={fileData.file.name}>
            <CloseSvg 
                size={17} 
                colour="#8d8c91" 
                action={() => removeFile(fileData)}
            />
        </File>
    )
}

export default UploadedFile;