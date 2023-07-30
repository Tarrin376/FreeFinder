import { FileIcon, defaultStyles, DefaultExtensionType } from "react-file-icon";

interface FileTypeIconProps {
    fileType: string
}

function FileTypeIcon({ fileType }: FileTypeIconProps) {
    const type = fileType.substring(fileType.indexOf("/") + 1);

    return (
        <FileIcon 
            extension={type} {...defaultStyles[type as DefaultExtensionType]} 
            foldColor="#4E73F8"
            glyphColor="#4E73F8"
            labelColor="#4E73F8"
            color="#ebebeb"
        />
    )
}

export default FileTypeIcon;