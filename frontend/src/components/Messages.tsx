import PopUpWrapper from "../wrappers/PopUpWrapper";
import { useContext, useState, useRef, useEffect } from "react";
import { UserContext } from "../providers/UserContext";
import AllMessagesIcon from "../assets/AllMessages.png";
import AddGroupIcon from "../assets/AddGroup.png";
import CreateGroup from "./CreateGroup";
import { AnimatePresence } from "framer-motion";
import { usePaginateData } from "../hooks/usePaginateData";
import { GroupPreview } from "../types/GroupPreview";
import { PaginationResponse } from "../types/PaginateResponse";
import GroupPreviewMessage from "./GroupPreviewMessage";
import Chat from "./Chat";

interface MessagesProps {
    setMessagesPopUp: React.Dispatch<React.SetStateAction<boolean>>
}

function Messages({ setMessagesPopUp }: MessagesProps) {
    const userContext = useContext(UserContext);
    const [createGroupPopUp, setCreateGroupPopUp] = useState<boolean>(false);
    const [page, setPage] = useState<{ value: number }>({ value: 1 });
    const [group, setGroup] = useState<GroupPreview>();

    const pageRef = useRef<HTMLDivElement>(null);
    const cursor = useRef<string>();
    const url = `/api/users/${userContext.userData.username}/message-groups/all`;
    const messageGroups = usePaginateData<{}, GroupPreview, PaginationResponse<GroupPreview>>(pageRef, cursor, url, page, setPage, {});

    function openCreateGroupPopUp() {
        setCreateGroupPopUp(true);
    }

    function updateMessageGroup(group: GroupPreview) {
        setGroup(group);
    }

    useEffect(() => {
        if (!group && messageGroups.data.length > 0) {
            setGroup(messageGroups.data[0]);
        }
    }, [group, messageGroups.data]);

    useEffect(() => {
        if (userContext.socket) {
            userContext.socket.on("user-typing", (username, id) => {
                console.log(username, id);
            });

            userContext.socket.on("receive-message", (message, id) => {
                console.log(message, id);
            });
        }

        return () => {
            userContext.socket?.removeAllListeners("user-typing");
            userContext.socket?.removeAllListeners("receive-message");
        }
    }, [userContext.socket]);

    return (
        <PopUpWrapper setIsOpen={setMessagesPopUp} title="Messages" styles="!max-w-[1100px] h-[1100px]">
            <AnimatePresence>
                {createGroupPopUp && 
                <CreateGroup 
                    setCreateGroupPopUp={setCreateGroupPopUp} 
                />}
            </AnimatePresence>
            <div className="flex flex-1 overflow-y-hidden">
                <div className="flex flex-col w-[340px] flex-shrink-0 border-r border-light-border-gray pr-3">
                    <div className="flex items-center justify-between w-full mb-4">
                        <div className="flex items-center gap-2">
                            <img src={AllMessagesIcon} className="w-[16px] h-[16px]" alt="" />
                            <p className="text-side-text-gray text-[15px]">{`All messages (${messageGroups.count.current})`}</p>
                        </div>
                        <img 
                            src={AddGroupIcon} 
                            className="w-[25px] h-[25px] cursor-pointer" 
                            onClick={openCreateGroupPopUp}
                            alt="" 
                        />
                    </div>
                    <div className="overflow-y-scroll flex-grow w-full pr-[8px] flex flex-col gap-2" ref={pageRef}>
                        {messageGroups.data.map((msgGroup: GroupPreview, index: number) => {
                            return (
                                <GroupPreviewMessage 
                                    group={msgGroup}
                                    selectedGroup={group}
                                    action={updateMessageGroup}
                                    key={index}
                                />
                            )
                        })}
                    </div>
                </div>
                {group ? 
                <Chat 
                    group={group} 
                    key={group.groupID} 
                /> : 
                <div className="flex-grow flex items-center justify-center">
                    <p className="text-side-text-gray text-[18px]">You have had no conversations yet.</p>
                </div>}
            </div>
        </PopUpWrapper>
    )
}

export default Messages;