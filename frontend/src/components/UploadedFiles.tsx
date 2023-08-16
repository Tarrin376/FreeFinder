import CloseSvg from "./CloseSvg";
import { FileData } from "../types/FileData";
import File from "./File";

interface UploadedFilesProps {
    uploadedFiles: FileData[],
    removeFile: (file: FileData) => void,
}

function UploadedFiles({ uploadedFiles, removeFile }: UploadedFilesProps) {
    return (
        <div className="flex-grow flex flex-wrap gap-2 overflow-hidden mb-3">
            {uploadedFiles.map((data: FileData, index: number) => {
                return (
                    <File fileType={data.file.type} fileName={data.file.name} key={index}>
                        <CloseSvg 
                            size={17} 
                            colour="#7e7d82" 
                            action={() => removeFile(data)}
                        />
                    </File>
                )
            })}
        </div>
    )
}

export default UploadedFiles;