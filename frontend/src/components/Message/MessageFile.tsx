import { IMessageFile } from "../../models/IMessageFile";
import LoadingSvg from "../svg/LoadingSvg";
import File from "../File/File";
import DownloadIcon from "../../assets/download.png";

interface MessageFileProps {
    file: IMessageFile,
    sending: boolean
}

function MessageFile({ file, sending }: MessageFileProps) {
    return (
        <File fileType={file.fileType} fileName={file.name}>
            {!sending ?
            <a href={file.url} download={file.name} target="_blank" rel="noreferrer">
                <button className="main-btn !p-2 w-fit !h-[30px] rounded-[6px] flex-shrink-0" title={`download '${file.name}'`}>
                    <img src={DownloadIcon} className="min-w-[16px] min-h-[16px]" alt="Download" />
                </button>
            </a> : 
            <div className="flex-shrink-0">
                <LoadingSvg 
                    size={20} 
                    colour="#4169f7" 
                />
            </div>}
        </File>
    )
}

export default MessageFile;