import TickSvg from "../TickSvg";

interface MessageSentProps {
    sendingMessage: boolean,
    colour: string
}

function MessageSent({ sendingMessage, colour }: MessageSentProps) {
    return (
        <div className="flex-shrink-0 h-[16px] w-[32px] relative">
            {!sendingMessage && <TickSvg
                size={16}
                colour={colour}
                styles="absolute bottom-0 right-[9px]"
            />}
            <TickSvg
                size={16}
                colour={colour}
                styles="absolute bottom-0 right-0"
            />
        </div>
    )
}

export default MessageSent;