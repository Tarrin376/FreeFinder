import PopUpWrapper from "../../wrappers/PopUpWrapper";
import { useContext, useState, useRef, useEffect, useCallback } from "react";
import { UserContext } from "../../providers/UserProvider";
import AllMessagesIcon from "../../assets/AllMessages.png";
import AddGroupIcon from "../../assets/AddGroup.png";
import CreateGroup from "../../components/ChatGroup/CreateGroup";
import { AnimatePresence } from "framer-motion";
import { usePaginateData } from "../../hooks/usePaginateData";
import { GroupPreview } from "../../types/GroupPreview";
import { PaginationResponse } from "../../types/PaginateResponse";
import SelectedGroupChat from "./SelectedGroupChat/SelectedGroupChat";
import AllGroupsSidebar from "./AllGroupsSidebar";
import { useWindowSize } from "src/hooks/useWindowSize";

interface LiveChatProps {
    group: GroupPreview | undefined,
    setGroup: React.Dispatch<React.SetStateAction<GroupPreview | undefined>>,
    setMessagesPopUp: React.Dispatch<React.SetStateAction<boolean>>,
    setGlobalUnreadMessages: React.Dispatch<React.SetStateAction<number>>
}

export const MIN_DUAL_WIDTH = 835;

function LiveChat({ setMessagesPopUp, group, setGroup, setGlobalUnreadMessages }: LiveChatProps) {
    const userContext = useContext(UserContext);
    const [createGroupPopUp, setCreateGroupPopUp] = useState<boolean>(false);
    const [page, setPage] = useState<{ value: number }>({ value: 1 });

    const pageRef = useRef<HTMLDivElement>(null);
    const cursor = useRef<string>();

    const url = `/api/users/${userContext.userData.username}/message-groups/all`;
    const messageGroups = usePaginateData<{}, GroupPreview, PaginationResponse<GroupPreview>>(pageRef, cursor, url, page, setPage, {}, false, joinRooms);
    const windowSize = useWindowSize();

    const [allGroups, setAllGroups] = useState<GroupPreview[]>([]);
    const [groupCount, setGroupCount] = useState<number>(0);

    function openCreateGroupPopUp() {
        setCreateGroupPopUp(true);
    }

    function joinRooms(resp: PaginationResponse<GroupPreview>) {
        for (const group of resp.next) {
            userContext.socket?.emit("join-message-group", group.groupID);
        }
    }

    const showNewGroup = useCallback((group: GroupPreview) => {
        userContext.socket?.emit("join-message-group", group.groupID);
        setAllGroups((allGroups) => [group, ...allGroups]);
        setGroupCount((groupCount) => groupCount + 1);
    }, [userContext.socket]);

    const updateMembers = useCallback((members: GroupPreview["members"], id: string) => {
        if (id === group?.groupID) {
            setGroup((group) => {
                if (!group) return group;
                return {
                    ...group,
                    members: members
                };
            });
        }

        setAllGroups((allGroups) => allGroups.map((group: GroupPreview) => {
            if (group.groupID === id) {
                return {
                    ...group,
                    members: members
                };
            } else {
                return group;
            }
        }));
    }, [group?.groupID, setGroup]);

    useEffect(() => {
        setGroupCount(messageGroups.count.current);
        setAllGroups(messageGroups.data);
    }, [messageGroups.data, messageGroups.count]);

    useEffect(() => {
        if (!group && allGroups.length > 0 && windowSize >= 835) {
            setGroup(allGroups[0]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [group, allGroups, setGroup]);

    useEffect(() => {
        userContext.socket?.on("new-group", showNewGroup);
        userContext.socket?.on("show-updated-members", updateMembers);

        return () => {
            userContext.socket?.off("new-group", showNewGroup);
            userContext.socket?.off("show-updated-members", updateMembers);
        }
    }, [userContext.socket, showNewGroup, updateMembers]);

    useEffect(() => {
        return () => {
            userContext.socket?.emit("leave-rooms");
            setGroup(undefined);
        }
    }, [userContext.socket, setGroup]);

    return (
        <PopUpWrapper setIsOpen={setMessagesPopUp} title="Messages" styles="!max-w-[950px] !h-[950px]">
            <div className="flex-grow flex min-h-0">
                <AnimatePresence>
                    {createGroupPopUp && 
                    <CreateGroup 
                        setCreateGroupPopUp={setCreateGroupPopUp} 
                    />}
                </AnimatePresence>
                <div className="flex flex-grow">
                    <div className={`flex flex-col ${(windowSize < MIN_DUAL_WIDTH && group ? "hidden" : "")} 
                    ${windowSize < MIN_DUAL_WIDTH && !group ? "flex-grow" : "w-[290px] border-r border-light-border-gray pr-3"} flex-shrink-0`}>
                        <div className="flex items-center justify-between w-full mb-4">
                            <div className="flex items-center gap-2">
                                <img src={AllMessagesIcon} className="w-[16px] h-[16px]" alt="" />
                                <p className="text-side-text-gray text-[15px]">
                                    {`All messages (${groupCount})`}
                                </p>
                            </div>
                            <img 
                                src={AddGroupIcon} 
                                className="w-[25px] h-[25px] cursor-pointer" 
                                onClick={openCreateGroupPopUp}
                                alt="" 
                            />
                        </div>
                        <AllGroupsSidebar
                            allGroups={allGroups}
                            pageRef={pageRef}
                            group={group}
                            setGroup={setGroup}
                            setGlobalUnreadMessages={setGlobalUnreadMessages}
                        />
                    </div>
                    {(windowSize >= MIN_DUAL_WIDTH || group) &&
                    <>
                        {group ? 
                        <SelectedGroupChat 
                            group={group}
                            setAllGroups={setAllGroups}
                            setGroupCount={setGroupCount}
                            setGroup={setGroup}
                            key={group.groupID} 
                        /> : 
                        <div className="flex-grow flex items-center justify-center">
                            <p className="text-side-text-gray text-[18px]">
                                You are in no group chats.
                            </p>
                        </div>}
                    </>}
                </div>
            </div>
        </PopUpWrapper>
    )
}

export default LiveChat;