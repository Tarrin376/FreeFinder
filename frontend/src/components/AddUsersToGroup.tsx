import { FoundUsers } from "../types/FoundUsers";
import { useState, useContext } from "react";
import PopUpWrapper from "../wrappers/PopUpWrapper";
import AddPeople from "./AddPeople";
import { getAPIErrorMessage } from "../utils/getAPIErrorMessage";
import axios, { AxiosError } from "axios";
import Button from "./Button";
import AddIcon from "../assets/add.png";
import { GroupPreview } from "../types/GroupPreview";
import { UserContext } from "../providers/UserContext";
import ErrorMessage from "./ErrorMessage";

interface AddUsersToGroupProps {
    groupID: string,
    groupMembers: GroupPreview["members"],
    setToggleAddUsersPopUp: React.Dispatch<React.SetStateAction<boolean>>
}

function AddUsersToGroup({ groupID, groupMembers, setToggleAddUsersPopUp }: AddUsersToGroupProps) {
    const [addedUsers, setAddedUsers] = useState<FoundUsers>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const userContext = useContext(UserContext);

    async function addUsersToGroup(): Promise<string | undefined> {
        try {
            const usernames = addedUsers.map((user) => user.username);
            const resp = await axios.put<{ group: GroupPreview, sockets: string[], message: string }>
            (`/api/users/${userContext.userData.username}/message-groups/created/${groupID}`, {
                members: usernames
            });

            userContext.socket?.emit("update-members", [
                ...groupMembers, 
                ...addedUsers.map((user) => { return { user: user } })]
            , groupID);
            
            for (const socket of resp.data.sockets) {
                userContext.socket?.emit("added-to-group", socket, resp.data.group);
            }
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            return errorMessage;
        }
    }

    return (
        <PopUpWrapper setIsOpen={setToggleAddUsersPopUp} title="Add users to group">
            {errorMessage !== "" &&
            <ErrorMessage
                message={errorMessage}
                setErrorMessage={setErrorMessage}
                title="Failed to add users to group."
            />}
            <AddPeople
                groupMembers={groupMembers}
                addedUsers={addedUsers}
                setAddedUsers={setAddedUsers}
            />
            <Button
                action={addUsersToGroup}
                completedText="Users added to group"
                defaultText="Add users to group"
                loadingText="Adding users to group"
                styles={`main-btn items-center justify-center gap-2 ${addedUsers.length === 0 ? "invalid-button" : ""} mt-7`}
                textStyles="text-main-white"
                setErrorMessage={setErrorMessage}
                loadingSvgSize={28}
                whenComplete={() => setToggleAddUsersPopUp(false)}
                keepErrorMessage={true}
            >
                <img src={AddIcon} alt="" className="w-[16px] h-[16px]" />
            </Button>
        </PopUpWrapper>
    )
}

export default AddUsersToGroup;