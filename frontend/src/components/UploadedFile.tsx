import CloseSvg from "./CloseSvg";
import FileTypeIcon from "./FileTypeIcon";

interface UploadedFileProps {
    file: File
}

function UploadedFile({ file }: UploadedFileProps) {
    return (
        <div className="flex justify-between items-center gap-4 border border-light-border-gray rounded-full px-3 py-1 overflow-hidden">
            <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-[20px] h-full">
                    <FileTypeIcon file={file} />
                </div>
                <span className="text-side-text-gray text-sm text-ellipsis overflow-hidden whitespace-nowrap">
                    {file.name}
                </span>
            </div>
            <CloseSvg size={17} />
        </div>
    )
}

export default UploadedFile;