import PopUpWrapper from "../wrappers/PopUpWrapper";
import FileTypeIcon from "./FileTypeIcon";
import TickIcon from "../assets/tick.svg";

interface SupportedFileFormatsProps {
    setToggleSupportedFormats: React.Dispatch<React.SetStateAction<boolean>>
}

export const SUPPORTED_FORMATS = [
    'image',
    'video',
    'audio',
    'raw',
    'text/csv',
    'text/plain',
    'application/json',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

function SupportedFileFormats({ setToggleSupportedFormats }: SupportedFileFormatsProps) {
    return (
        <PopUpWrapper title="Supported file formats" setIsOpen={setToggleSupportedFormats} styles="!max-w-[500px]">
            <div className="overflow-y-scroll max-h-[400px] flex flex-col gap-4 pr-[8px] mt-3">
                {SUPPORTED_FORMATS.map((format: string, index: number) => {
                    return (
                        <div key={index} className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-[20px] h-full flex-shrink-0">
                                    <FileTypeIcon fileType={format} />
                                </div>
                                <p className="text-side-text-gray text-[15px] break-all">{format}</p>
                            </div>
                            <img 
                                src={TickIcon} 
                                className="w-[19px] h-[19px]" 
                                alt="" 
                            />
                        </div>
                    )
                })}
            </div>
        </PopUpWrapper>
    )
}

export default SupportedFileFormats;