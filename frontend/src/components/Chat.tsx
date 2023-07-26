import ProfilePicAndStatus from "./ProfilePicAndStatus";
import ChatBox from "./ChatBox";
import { GroupPreview } from "../types/GroupPreview";
import GroupMembers from "./GroupMembers";
import { useState, useContext, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import ErrorPopUp from "./ErrorPopUp";
import CloseSvg from "./CloseSvg";
import axios, { AxiosError } from "axios";
import { UserContext } from "../providers/UserContext";
import { getAPIErrorMessage } from "../utils/getAPIErrorMessage";
import Actions from "./Actions";
import Button from "./Button";
import AddUserIcon from "../assets/AddGroup.png";
import AddUsersToGroup from "./AddUsersToGroup";

interface ChatProps {
    group: GroupPreview,
    setAllGroups: React.Dispatch<React.SetStateAction<GroupPreview[]>>,
    setGroup: React.Dispatch<React.SetStateAction<GroupPreview | undefined>>
}

const visibleMembers = 3;

function Chat({ group, setAllGroups, setGroup }: ChatProps) {
    const [toggleGroupMembers, setToggleGroupMembers] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [groupMembers, setGroupMembers] = useState<GroupPreview["members"]>(group.members);
    const [toggleAddUsersPopUp, setToggleAddUsersPopUp] = useState<boolean>(false);
    const userContext = useContext(UserContext);

    async function removeUser(userID: string): Promise<string | undefined> {
        try {
            await axios.delete<{ message: string }>(`/api/users/${userContext.userData.username}/created-groups/${group.groupID}/${userID}`);
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            return errorMessage;
        }
    }

    function updateGroupMembers(userID: string) {
        setGroupMembers((members) => members.filter((member) => member.user.userID !== userID));
    }

    async function deleteGroup(): Promise<string | undefined> {
        try {
            await axios.delete<{ message: string }>(`/api/users/${userContext.userData.username}/created-groups/${group.groupID}`);
            setAllGroups((cur) => cur.filter((x) => x.groupID !== group.groupID));
            setGroup(undefined);
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            return errorMessage;
        }
    }

    async function leaveGroup(): Promise<string | undefined> {
        try {
            await axios.delete<{ message: string }>(`/api/users/${userContext.userData.username}/message-groups/${group.groupID}`);
            setAllGroups((cur) => cur.filter((x) => x.groupID !== group.groupID));
            setGroup(undefined);
            userContext.socket?.emit("leave-room", userContext.userData.userID, group.groupID);
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            return errorMessage;
        }
    }

    const updateUserLeftRoom = useCallback((userID: string, id: string) => {
        if (id === group.groupID) {
            updateGroupMembers(userID);
        }
    }, [group.groupID]);

    useEffect(() => {
        setAllGroups((cur) => {
            return cur.map((x: GroupPreview) => {
                if (x.groupID !== group.groupID) {
                    return x;
                } else {
                    return {
                        ...x,
                        members: groupMembers
                    }
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
                    setGroupMembers={setGroupMembers}
                    setToggleAddUsersPopUp={setToggleAddUsersPopUp}
                />}
            </AnimatePresence>
            <div className="border-b border-light-border-gray bg-transparent pl-6 pb-6 w-full flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-4">
                    <ProfilePicAndStatus
                        profilePicURL=""
                        size={50}
                        username={group.groupName}
                        statusStyles="before:hidden"
                    />
                    <div>
                        <div className="flex items-center gap-3">
                            <p className="text-[20px]">{group.groupName}</p>
                            <button className="change">Change</button>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="inline-flex relative" onMouseLeave={() => setToggleGroupMembers(false)}>
                        {groupMembers.slice(0, visibleMembers).map((member, index) => {
                            return (
                                <div className="w-fit h-fit relative ml-[-12px] outline outline-[3px] outline-main-white rounded-full" key={index}>
                                    <ProfilePicAndStatus
                                        profilePicURL={member.user.profilePicURL}
                                        size={45}
                                        username={member.user.username}
                                        statusStyles="before:hidden"
                                        key={index}
                                    />
                                    {member.user.username !== userContext.userData.username && userContext.userData.userID === group.creatorID && 
                                    <div className="bg-error-text text-main-white rounded-full w-[18px] h-[18px] border-2 border-main-white
                                    absolute top-[30px] left-[0px] flex items-center justify-center cursor-pointer"
                                    onClick={async () => {
                                        const result = await removeUser(member.user.userID);
                                        if (result) {
                                            setErrorMessage(result);
                                        } else {
                                            userContext.socket?.emit("leave-room", member.user.userID, group.groupID);
                                        }
                                    }}>
                                        <CloseSvg 
                                            size="12px"
                                            colour="#fdfdfd" 
                                        />
                                    </div>}
                                </div>
                            )
                        })}
                        {groupMembers.length > visibleMembers &&
                        <div className="w-[45px] h-[45px] rounded-full outline outline-[3px] outline-main-white 
                        bg-very-light-gray flex items-center justify-center ml-[-13px] cursor-pointer z-10" 
                        onMouseEnter={() => setToggleGroupMembers(true)}>
                            <p className="text-[18px] text-side-text-gray">
                                {`+${groupMembers.length - visibleMembers}`}
                            </p>
                        </div>}
                        <AnimatePresence>
                            {toggleGroupMembers &&
                            <GroupMembers 
                                groupMembers={groupMembers} 
                                creatorID={group.creatorID}
                                removeUser={removeUser}
                                setErrorMessage={setErrorMessage}
                                groupID={group.groupID}
                            />}
                        </AnimatePresence>
                    </div>
                    {group.creatorID === userContext.userData.userID && 
                    <img 
                        src={AddUserIcon} 
                        className="w-[25px] h-[25px] cursor-pointer"
                        onClick={() => setToggleAddUsersPopUp(true)}
                        alt=""
                    />}
                    <Actions>
                        {group.creatorID === userContext.userData.userID ?
                        <Button
                            action={deleteGroup}
                            defaultText="Delete group"
                            loadingText="Deleting group"
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
            <ChatBox groupID={group.groupID} />
        </div>
    )
}

export default Chat;