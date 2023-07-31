import FileTypeIcon from "./FileTypeIcon";

interface FileProps {
    fileType: string,
    fileName: string,
    children?: React.ReactNode,
    styles?: string
}

function File({ fileType, fileName, children, styles }: FileProps) {
    return (
        <div className={`flex justify-between items-center gap-4 border border-light-border-gray 
        bg-main-white rounded-[8px] p-[9px] pl-[10px] transition-all ease-in-out duration-200 ${styles}`}>
            <div className="flex items-center gap-[9px]">
                <div className="w-[20px] h-full flex-shrink-0">
                    <FileTypeIcon fileType={fileType} />
                </div>
                <span className="text-side-text-gray text-sm">
                    {fileName}
                </span>
            </div>
            {children}
        </div>
    )
}

export default File;