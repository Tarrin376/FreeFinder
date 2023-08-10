import { GroupPreview } from "../types/GroupPreview";
import { FoundUsers } from "../types/FoundUsers";
import { IMessage } from "../models/IMessage";
import Message from "./Message";
import { memo } from "react";

interface MessagesProps {
    messages: IMessage[],
    sendingMessage: boolean,
    groupMembers: GroupPreview["members"],
    seller: FoundUsers[number],
    workType: string,
    groupID: string,
    pageRef: React.RefObject<HTMLDivElement>
}

function Messages({ messages, sendingMessage, groupMembers, seller, workType, groupID, pageRef }: MessagesProps) {
    return (
        <div className="bg-transparent flex-grow overflow-y-scroll w-full flex flex-col-reverse items-end gap-6 p-4" ref={pageRef}>
            {messages.map((message: IMessage, index: number) => {
                return (
                    <Message
                        message={message}
                        key={message.messageID}
                        isLastMessage={index === 0}
                        sendingMessage={sendingMessage}
                        groupMembers={groupMembers}
                        seller={seller}
                        workType={workType}
                        groupID={groupID}
                    />
                )
            })}
        </div>
    )
}

export default memo(Messages);