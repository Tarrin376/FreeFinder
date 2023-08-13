
interface NotificationProps {
    title: string,
    text: string,
    time: string
}

function Notification({ title, text, time }: NotificationProps) {
    return (
        <div className="p-4 border-b border-light-border-gray cursor-pointer hover:bg-hover-light-gray">
            <div className="flex items-center gap-2">
                <div className="w-[7px] h-[7px] rounded-full bg-main-blue"></div>
                <h3>{title}</h3>
            </div>
            <p className="text-sm text-side-text-gray pl-[15px] mt-[6px]">{text}</p>
            <p className="text-sm text-side-text-gray font-bold pl-[15px] mt-[6px]">{time}</p>
        </div>
    )
}

export default Notification;