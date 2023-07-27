import { FileIcon, defaultStyles, DefaultExtensionType } from "react-file-icon";

interface FileProps {
    file: File,
    children: React.ReactNode,
    description: string,
    error?: boolean
}

function UploadedImage({ file, children, description, error }: FileProps) {
    const fileType = file.type.substring(file.type.indexOf("/") + 1);

    return (
        <div className="p-3 rounded-[8px] bg-[#f8f8f8] flex justify-between gap-[18px] items-center w-full">
            <div className="overflow-hidden">
                <div className="flex items-center gap-3 mb-3 overflow-hidden">
                    <div className="w-[27px] h-full">
                        <FileIcon extension={fileType} {...defaultStyles[fileType as DefaultExtensionType]} />
                    </div>
                    <p className="whitespace-nowrap text-ellipsis overflow-hidden">
                        {file.name}
                    </p>
                </div>
                <p className="text-side-text-gray text-[15px]">
                    {error && <span className="text-error-text">Error: </span>}
                    {description}
                </p>
            </div>
            <div className="flex flex-col gap-[10px] flex-shrink-0">
                {children}
            </div>
        </div>
    )
}

export default UploadedImage;