import TickIcon from "../assets/tick.svg";

interface MessageSentProps {
    sendingMessage: boolean
}

function MessageSent({ sendingMessage }: MessageSentProps) {
    return (
        <div className="w-[25px] h-[14px] relative flex-shrink-0">
            <img 
                src={TickIcon} 
                className="w-[16px] h-[16px] absolute right-0 top-0" 
                alt="" 
            />
            {!sendingMessage && <img 
                src={TickIcon} 
                className="w-[16px] h-[16px] absolute right-[9px] top-0" 
                alt="" 
            />}
        </div>
    )
}

export default MessageSent;