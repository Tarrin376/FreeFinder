import PopUpWrapper from "../wrappers/PopUpWrapper";

interface SupportedFileFormatsProps {
    toggleSupportedFormats: React.Dispatch<React.SetStateAction<boolean>>
}

export const supportedFormats = [
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

function SupportedFileFormats({ toggleSupportedFormats }: SupportedFileFormatsProps) {
    return (
        <PopUpWrapper title="Supported file formats" setIsOpen={toggleSupportedFormats}>
            <div className="overflow-y-scroll max-h-[640px] flex flex-col gap-4">
                
            </div>
        </PopUpWrapper>
    )
}

export default SupportedFileFormats;