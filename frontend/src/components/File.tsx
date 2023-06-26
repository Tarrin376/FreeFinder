import PNGIcon from '../assets/png.png';
import JPGIcon from '../assets/jpg.png';

interface FileProps {
    file: File,
    children: React.ReactNode,
    description: string,
    error?: boolean
}

function File({ file, children, description, error }: FileProps) {
    return (
        <div className="p-3 rounded-[8px] bg-[#f8f9fa] flex justify-between gap-[18px] items-center w-full">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <img src={file.type === "image/jpeg" ? JPGIcon : PNGIcon} alt="file type" className="w-[32px] h-[32px]" />
                    <p>{file.name}</p>
                </div>
                <p className="text-side-text-gray text-[15px]">
                    {error && <span className="text-error-text">Error: </span>}
                    {description}
                </p>
            </div>
            <div className="flex flex-col gap-[10px]">
                {children}
            </div>
        </div>
    )
}

export default File;