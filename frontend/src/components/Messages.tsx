import PopUpWrapper from "../wrappers/PopUpWrapper";
import { useContext, useState, useRef, useEffect, useCallback } from "react";
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
import { IMessage } from "../models/IMessage";

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
    const messageGroups = usePaginateData<{}, GroupPreview, PaginationResponse<GroupPreview>>(pageRef, cursor, url, page, setPage, {}, false, joinRooms);
    const [allGroups, setAllGroups] = useState<GroupPreview[]>([]);
    const [usersTyping, setUsersTyping] = useState<{ [key: string]: string[] }>({});

    function openCreateGroupPopUp() {
        setCreateGroupPopUp(true);
    }

    function updateMessageGroup(group: GroupPreview) {
        setGroup(group);
    }

    function joinRooms(resp: PaginationResponse<GroupPreview>) {
        for (const group of resp.next) {
            userContext?.socket?.emit("join-message-group", group.groupID);
        }
    }

    const updateUsersTyping = useCallback((username: string, id: string): void => {
        if (usersTyping[id]?.includes(username)) {
            return;
        }

        setUsersTyping((cur) => {
            const cpy = { ...cur };
            if (!cpy[id]) cpy[id] = [username];
            else cpy[id].push(username);
            return cpy;
        });

        setTimeout(() => {
            setUsersTyping((cur) => {
                const cpy = { ...cur };
                if (cpy[id]) {
                    cpy[id] = cpy[id].filter((user) => user !== username);
                    if (cpy[id].length === 0) {
                        delete cpy[id];
                    }
                }

                return cpy;
            });
        }, 5000);
    }, [usersTyping]);

    const showNewMessages = useCallback((message: IMessage, id: string): void => {
        setAllGroups((cur) => {
            return cur.map((x) => {
                if (x.groupID === id) {
                    return {
                        ...x,
                        lastMessage: message
                    }
                } else {
                    return x;
                }
            })
        });
    }, []);

    useEffect(() => {
        userContext.socket?.on("user-typing", updateUsersTyping);
        userContext.socket?.on("receive-message", showNewMessages);

        return () => {
            userContext.socket?.off("user-typing", updateUsersTyping);
            userContext.socket?.off("receive-message", showNewMessages);
        }
    }, [userContext.socket, updateUsersTyping, showNewMessages]);

    useEffect(() => {
        setAllGroups(messageGroups.data);
    }, [messageGroups.data]);

    useEffect(() => {
        if (!group && allGroups.length > 0) {
            setGroup(allGroups[0]);
        }
    }, [group, allGroups]);

    useEffect(() => {
        return () => {
            userContext.socket?.emit("leave-rooms");
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
                        {allGroups.map((msgGroup: GroupPreview, index: number) => {
                            return (
                                <GroupPreviewMessage 
                                    group={msgGroup}
                                    usersTyping={usersTyping}
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
                    setAllGroups={setAllGroups}
                    setGroup={setGroup}
                    key={group.groupID} 
                /> : 
                <div className="flex-grow flex items-center justify-center">
                    <p className="text-side-text-gray text-[18px]">You are in no group chats.</p>
                </div>}
            </div>
        </PopUpWrapper>
    )
}

export default Messages;