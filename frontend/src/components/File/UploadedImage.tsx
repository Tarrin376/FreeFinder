import FileTypeIcon from "./FileTypeIcon";
import { useWindowSize } from "src/hooks/useWindowSize";

interface FileProps {
    file: File,
    children: React.ReactNode,
    description: string,
    error?: boolean
}

function UploadedImage({ file, children, description, error }: FileProps) {
    const windowSize = useWindowSize();

    return (
        <div className={`p-3 rounded-[8px] bg-light-bg-gray flex justify-between gap-3 w-full
         ${windowSize < 430 ? "flex-col" : "items-center"}`}>
            <div className="overflow-hidden">
                <div className="flex items-center gap-3 mb-3 overflow-hidden">
                    <div className="w-[27px] h-full">
                        <FileTypeIcon fileType={file.type} />
                    </div>
                    <p className="whitespace-nowrap text-ellipsis overflow-hidden text-[15px]" title={file.name}>
                        {file.name}
                    </p>
                </div>
                <p className="text-side-text-gray text-[15px]">
                    {error && <span className="text-error-text text-[15px]">Error: </span>}
                    {description}
                </p>
            </div>
            <div className={`flex ${windowSize >= 430 || windowSize < 325 ? "flex-col" : ""} gap-[10px] flex-shrink-0`}>
                {children}
            </div>
        </div>
    )
}

export default UploadedImage;