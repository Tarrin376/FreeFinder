import { FileIcon, defaultStyles, DefaultExtensionType } from "react-file-icon";

interface FileTypeIconProps {
    file: File
}

function FileTypeIcon({ file }: FileTypeIconProps) {
    const fileType = file.type.substring(file.type.indexOf("/") + 1);

    return (
        <FileIcon 
            extension={fileType} {...defaultStyles[fileType as DefaultExtensionType]} 
            foldColor="#4E73F8"
            glyphColor="#4E73F8"
            labelColor="#4E73F8"
            color="#ebebeb"
        />
    )
}

export default FileTypeIcon;