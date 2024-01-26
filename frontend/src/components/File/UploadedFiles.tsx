import CloseSvg from "../CloseSvg";
import File from "./File";

interface UploadedFilesProps {
    uploadedFiles: File[],
    removeFile: (file: File) => void,
}

function UploadedFiles({ uploadedFiles, removeFile }: UploadedFilesProps) {
    return (
        <div className="flex-grow flex flex-wrap gap-2 overflow-hidden mb-3">
            {uploadedFiles.map((data: File, index: number) => {
                return (
                    <File fileType={data.type} fileName={data.name} key={index}>
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