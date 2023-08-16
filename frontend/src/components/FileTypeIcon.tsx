import { FileIcon, defaultStyles, DefaultExtensionType } from "react-file-icon";

interface FileTypeIconProps {
    fileType: string
}

function FileTypeIcon({ fileType }: FileTypeIconProps) {
    const type = fileType.substring(fileType.indexOf("/") + 1);

    return (
        <FileIcon 
            extension={type} {...defaultStyles[type as DefaultExtensionType]} 
            foldColor="#4169f7"
            glyphColor="#4169f7"
            labelColor="#4169f7"
            color="#ebebec"
        />
    )
}

export default FileTypeIcon;