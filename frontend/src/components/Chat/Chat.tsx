import ProfilePicAndStatus from "../Profile/ProfilePicAndStatus";
import ChatBox from "./ChatBox";
import { GroupPreview } from "../../types/GroupPreview";
import GroupMembers from "../MessageGroup/GroupMembers";
import { useState, useContext, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import ErrorPopUp from "../Error/ErrorPopUp";
import axios, { AxiosError } from "axios";
import { UserContext } from "../../providers/UserProvider";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";
import Actions from "../Actions";
import Button from "../Button";
import AddUserIcon from "../../assets/AddGroup.png";
import AddUsersToGroup from "../MessageGroup/AddUsersToGroup";
import ServiceID from "../ServiceID";
import { useWindowSize } from "src/hooks/useWindowSize";
import Arrow from "../Arrow";
import GroupMembersCount from "../MessageGroup/GroupMembersCount";
import InfoPopUp from "../InfoPopUp";
import { MIN_DUAL_WIDTH } from "../Message/MessagePreviews";
import VisibleGroupMember from "../MessageGroup/VisibleGroupMember";
import OutsideClickHandler from "react-outside-click-handler";

interface ChatProps {
    group: GroupPreview,
    setAllGroups: React.Dispatch<React.SetStateAction<GroupPreview[]>>,
    setGroupCount: React.Dispatch<React.SetStateAction<number>>,
    setGroup: React.Dispatch<React.SetStateAction<GroupPreview | undefined>>
}

const VISIBLE_MEMBERS = 2;
const SHOW_SERVICE_ID_WIDTH = 575;

function Chat({ group, setAllGroups, setGroupCount, setGroup }: ChatProps) {
    const [toggleGroupMembers, setToggleGroupMembers] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [groupMembers, setGroupMembers] = useState<GroupPreview["members"]>(group.members);
    const [toggleAddUsersPopUp, setToggleAddUsersPopUp] = useState<boolean>(false);
    const [infoMessage, setInfoMessage] = useState<string>("");
    const [toggleActions, setToggleActions] = useState<boolean>(false);

    const userContext = useContext(UserContext);
    const windowSize = useWindowSize();

    async function removeUser(userID: string): Promise<string | undefined> {
        try {
            await axios.delete<{ message: string }>(`/api/users/${userContext.userData.username}/message-groups/created/${group.groupID}/${userID}`);
            userContext.socket?.emit("leave-room", userID, group.groupID);

            if (groupMembers.length - 1 === VISIBLE_MEMBERS) {
                setToggleGroupMembers(false);
            }

            removeGroupMember(userID);
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            return errorMessage;
        }
    }

    function removeGroupMember(userID: string) {
        setGroupMembers((members) => members.filter((member) => member.user.userID !== userID));
    }

    async function removeVisibleGroupMember(userID: string): Promise<void> {
        const errorMessage = await removeUser(userID);
        if (errorMessage) {
            setErrorMessage(errorMessage);
        }
    }

    async function deleteGroup(): Promise<string | undefined> {
        try {
            await axios.delete<{ message: string }>(`/api/users/${userContext.userData.username}/message-groups/created/${group.groupID}`);
            for (const groupMember of groupMembers) {
                userContext.socket?.emit("leave-room", groupMember.user.userID, group.groupID);
            }
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            return errorMessage;
        }
        finally {
            setToggleActions(false);
        }
    }

    async function leaveGroup(): Promise<string | undefined> {
        try {
            await axios.delete<{ message: string }>(`/api/users/${userContext.userData.username}/message-groups/${group.groupID}`);
            userContext.socket?.emit("leave-room", userContext.userData.userID, group.groupID);
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            return errorMessage;
        }
        finally {
            setToggleActions(false);
        }
    }

    const updateUserLeftRoom = useCallback((userID: string, id: string) => {
        if (id === group.groupID) {
            removeGroupMember(userID);
        }

        if (userID === userContext.userData.userID) {
            setAllGroups((cur) => cur.filter((x) => x.groupID !== id));
            setGroupCount((cur) => cur - 1);
            setGroup(undefined);
        }
    }, [group.groupID, userContext.userData.userID, setAllGroups, setGroup, setGroupCount]);

    useEffect(() => {
        setAllGroups((cur) => {
            return cur.map((x: GroupPreview) => {
                if (x.groupID !== group.groupID) {
                    return x;
                } else {
                    return {
                        ...x,
                        members: groupMembers
                    };
                }
            })
        });
    }, [groupMembers, group.groupID, setAllGroups]);

    useEffect(() => {
        userContext.socket?.on("left-room", updateUserLeftRoom);

        return () => {
            userContext.socket?.off("left-room", updateUserLeftRoom);
        }
    }, [userContext.socket, updateUserLeftRoom]);

    useEffect(() => {
        setGroupMembers(group.members);
    }, [group.members]);

    return (
        <div className="flex flex-col flex-grow">
            <AnimatePresence>
                {errorMessage !== "" &&
                <ErrorPopUp
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                />}
                {toggleAddUsersPopUp && 
                <AddUsersToGroup
                    groupID={group.groupID}
                    groupMembers={groupMembers}
                    setToggleAddUsersPopUp={setToggleAddUsersPopUp}
                />}
                {infoMessage !== "" &&
                <InfoPopUp
                    message={infoMessage}
                    closePopUp={() => setInfoMessage("")}
                    styles="bg-main-blue"
                />}
            </AnimatePresence>
            <div className={`bg-transparent w-full min-w-0 flex items-center justify-between gap-5 
            ${windowSize >= MIN_DUAL_WIDTH ? "pl-5" : ""} ${windowSize < SHOW_SERVICE_ID_WIDTH ? "pb-5 border-b border-light-border-gray" : ""} 
            ${windowSize < 500 ? "!pb-4" : ""}`}>
                <div className="flex items-center gap-4 overflow-hidden">
                    {windowSize < MIN_DUAL_WIDTH && 
                    <Arrow
                        action={() => setGroup(undefined)}
                        direction="left"
                        alt="back"
                        size={45}
                    />}
                    {windowSize >= 500 &&
                    <ProfilePicAndStatus
                        profilePicURL=""
                        size={windowSize >= MIN_DUAL_WIDTH ? 47 : 40}
                        username={group.groupName}
                    />}
                    <p className="text-[17px] text-ellipsis whitespace-nowrap overflow-hidden" title={group.groupName}>
                        {group.groupName}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <OutsideClickHandler onOutsideClick={() => setToggleGroupMembers(false)}>
                        <div className="flex relative">
                            {windowSize >= SHOW_SERVICE_ID_WIDTH && groupMembers.slice(0, VISIBLE_MEMBERS).map((member) => {
                                return (
                                    <VisibleGroupMember
                                        creatorID={group.creatorID}
                                        profilePicURL={member.user.profilePicURL}
                                        username={member.user.username}
                                        action={() => removeVisibleGroupMember(member.user.userID)}
                                        key={member.user.userID}
                                    />
                                )
                            })}
                            {groupMembers.length > VISIBLE_MEMBERS &&
                            <GroupMembersCount
                                action={() => setToggleGroupMembers(true)}
                                numMembers={groupMembers.length}
                                visibleMembers={VISIBLE_MEMBERS}
                                size={windowSize >= MIN_DUAL_WIDTH ? 47 : 40}
                                styles="ml-[-13px] z-10"
                            />}
                            <AnimatePresence>
                                {toggleGroupMembers &&
                                <GroupMembers 
                                    groupMembers={groupMembers} 
                                    creatorID={group.creatorID}
                                    removeUser={removeUser}
                                    setErrorMessage={setErrorMessage}
                                />}
                            </AnimatePresence>
                        </div>
                    </OutsideClickHandler>
                    {group.creatorID === userContext.userData.userID && 
                    <img 
                        src={AddUserIcon} 
                        className="w-[25px] h-[25px] cursor-pointer ml-[5px]"
                        onClick={() => setToggleAddUsersPopUp(true)}
                        alt=""
                    />}
                    <Actions size={45} toggleActions={toggleActions} setToggleActions={setToggleActions}>
                        {windowSize < SHOW_SERVICE_ID_WIDTH &&
                        <ServiceID
                            data={group.postID}
                            setInfoMessage={setInfoMessage}
                            postID={group.postID}
                            textSize={16}
                            hideText={true}
                        />}
                        {group.creatorID === userContext.userData.userID ?
                        <Button
                            action={deleteGroup}
                            defaultText="Delete group"
                            loadingText="Deleting group (this may take a while)"
                            styles="bg-transparent border-none"
                            textStyles="text-error-text whitespace-nowrap"
                            setErrorMessage={setErrorMessage}
                            loadingSvgSize={24}
                            loadingSvgColour="#F43C3C"
                        /> : 
                        <Button
                            action={leaveGroup}
                            defaultText="Leave group"
                            loadingText="Leaving group"
                            styles="bg-transparent border-none"
                            textStyles="text-error-text whitespace-nowrap"
                            setErrorMessage={setErrorMessage}
                            loadingSvgSize={24}
                            loadingSvgColour="#F43C3C"
                        />}
                    </Actions>
                </div>
            </div>
            {windowSize >= SHOW_SERVICE_ID_WIDTH &&
            <div className={`${windowSize >= MIN_DUAL_WIDTH ? "pl-5" : ""} py-3 pr-0 bg-transparent border-b border-light-border-gray w-full`}>
                <ServiceID
                    data={group.postID}
                    setInfoMessage={setInfoMessage}
                    postID={group.postID}
                    textSize={14}
                    styles="w-fit"
                />
            </div>}
            <ChatBox 
                seller={group.seller}
                workType={group.workType}
                groupID={group.groupID}
                groupMembers={groupMembers}
            />
        </div>
    )
}

export default Chat;