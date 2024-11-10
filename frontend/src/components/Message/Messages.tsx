import { GroupPreview } from "../../types/GroupPreview";
import { FoundUsers } from "../../types/FoundUsers";
import { IMessage } from "../../models/IMessage";
import Message from "../../components/Message/Message";
import { memo } from "react";

interface MessagesProps {
    messages: IMessage[],
    sendingMessage: boolean,
    groupMembers: GroupPreview["members"],
    seller: FoundUsers[number],
    workType: string,
    groupID: string
}

function Messages({ messages, sendingMessage, groupMembers, seller, workType, groupID }: MessagesProps) {
    return (
        <>
            {messages.map((message: IMessage, index: number) => {
                const date = new Date(message.createdAt).toLocaleDateString();
                const prevDate = index < messages.length - 1 ? new Date(messages[index + 1].createdAt).toLocaleDateString() : undefined;

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
                        firstMessageOfDay={date !== prevDate}
                    />
                )
            })}
        </>
    )
}

export default memo(Messages);