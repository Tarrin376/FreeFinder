import PopUpWrapper from "../../wrappers/PopUpWrapper";
import { useState, useContext } from "react";
import ErrorMessage from "../Error/ErrorMessage";
import AddIcon from "../../assets/add.png";
import axios, { AxiosError } from "axios";
import { FoundUsers } from "../../types/FoundUsers";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";
import Button from "../ui/Button";
import { UserContext } from "../../providers/UserProvider";
import AddPeople from "./AddPeople";
import { GroupPreview } from "../../types/GroupPreview";
import { SendNotification } from "src/types/SendNotification";
import { INotification } from "src/models/INotification";

interface CreateGroupProps {
    setCreateGroupPopUp: React.Dispatch<React.SetStateAction<boolean>>,
    seller?: FoundUsers[number],
    initialServiceID?: string
}

type OptionalNotificaton = SendNotification & {
    notification?: INotification
}

function CreateGroup({ setCreateGroupPopUp, seller, initialServiceID }: CreateGroupProps) {
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [addedUsers, setAddedUsers] = useState<FoundUsers>(seller ? [seller] : []);
    const [groupName, setGroupName] = useState<string>("");
    const [serviceID, setServiceID] = useState<string>(initialServiceID ?? "");
    const userContext = useContext(UserContext);

    function updateServiceID(e: React.ChangeEvent<HTMLInputElement>): void {
        setServiceID(e.target.value);
    }

    function validInputs(): boolean {
        return addedUsers.length > 0 && groupName !== "" && serviceID !== "";
    }

    async function findSeller(): Promise<string | undefined> {
        try {
            const resp = await axios.get<{ sellerSummary: FoundUsers[number], message: string }>
            (`/api/posts/${serviceID}/seller-summary`);
            setAddedUsers([resp.data.sellerSummary]);
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            return errorMessage;
        }
    }

    async function createNewGroup(): Promise<string | undefined> {
        try {
            const resp = await axios.post<{ group: GroupPreview, notis: OptionalNotificaton[], message: string }>
            (`/api/users/${userContext.userData.username}/message-groups/created`, {
                members: [userContext.userData.username, ...addedUsers.map((user) => user.username)],
                groupName: groupName,
                postID: serviceID
            });

            for (const noti of resp.data.notis) {
                userContext.socket?.emit("added-to-group", noti.socketID, resp.data.group);
                if (noti.notification != null) {
                    userContext.socket?.emit("send-notification", noti.notification, noti.socketID);
                }
            }
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            return errorMessage;
        }
    }

    return (
        <PopUpWrapper setIsOpen={setCreateGroupPopUp} title="Create new message group">
            <div>
                {errorMessage !== "" && 
                <ErrorMessage 
                    message={errorMessage} 
                    setErrorMessage={setErrorMessage} 
                    title="Something went wrong"
                />}
                <p className="mb-2">Service ID</p>
                <input 
                    type="text" 
                    className="search-bar"
                    placeholder="Enter service ID"
                    value={serviceID}
                    onChange={updateServiceID}
                    maxLength={36}
                    disabled={initialServiceID !== undefined}
                />
                {serviceID !== "" && initialServiceID === undefined &&
                <Button
                    action={findSeller}
                    completedText="Found seller"
                    defaultText="Find seller"
                    loadingText="Finding seller"
                    styles="side-btn !h-[30px] rounded-[6px] mt-3"
                    textStyles="text-main-blue"
                    setErrorMessage={setErrorMessage}
                    loadingSvgSize={20}
                    loadingSvgColour="#4169f7"
                    keepErrorMessage={true}
                />}
                <p className="mb-2 mt-4">Group Name</p>
                <input 
                    type="text" 
                    className="search-bar mb-4"
                    placeholder="Enter group name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    maxLength={30}
                />
                <AddPeople
                    addedUsers={addedUsers}
                    setAddedUsers={setAddedUsers}
                />
            </div>
            <Button
                action={createNewGroup}
                completedText="Group created"
                defaultText="Create new group"
                loadingText="Creating group"
                styles={`main-btn items-center justify-center gap-2 ${!validInputs() ? "invalid-button" : ""}`}
                textStyles="text-main-white"
                setErrorMessage={setErrorMessage}
                loadingSvgSize={28}
                whenComplete={() => setCreateGroupPopUp(false)}
                keepErrorMessage={true}
            >
                <img src={AddIcon} alt="" className="w-[16px] h-[16px]" />
            </Button>
        </PopUpWrapper>
    )
}

export default CreateGroup;