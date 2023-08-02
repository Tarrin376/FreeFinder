import { IMessageFile } from "../models/IMessageFile";
import LoadingSvg from "./LoadingSvg";
import File from "./File";

interface MessageFileProps {
    file: IMessageFile,
    sending: boolean
}

function MessageFile({ file, sending }: MessageFileProps) {
    return (
        <>
            {file.fileType.includes("image") ? !sending ?
            <a href={file.url} download={file.name} target="_blank" rel="noreferrer" className="w-fit h-fit">
                <img src={file.url} alt={file.name} className="rounded-[6px]" />
            </a> :
            <div className="flex items-center gap-4">
                <p className="text-sm text-main-blue">Uploading image</p>
                <LoadingSvg 
                    size={20} 
                    colour="#4E73F8" 
                />
            </div> :
            <File fileType={file.fileType} fileName={file.name}>
                {!sending ?
                <a href={file.url} download={file.name} target="_blank" rel="noreferrer">
                    <button className="main-btn w-fit !h-[30px] rounded-[6px] text-sm">
                        Download
                    </button>
                </a> : 
                <div className="flex-shrink-0">
                    <LoadingSvg 
                        size={20} 
                        colour="#4E73F8" 
                    />
                </div>}
            </File>}
        </>
    )
}

export default MessageFile;